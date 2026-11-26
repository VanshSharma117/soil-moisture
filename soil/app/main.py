import os, asyncio
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai

from app.database import engine, SessionLocal
from app.models import Base, Reading, Recommendation, KBItem
from app.analysis import analyze_reading
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse




load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(
    "gemini-2.5-flash",
    system_instruction="You are a soil health assistant."
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Soil Monitoring System (SQLite)")

# Serve frontend safely (does NOT break APIs)
app.mount("/ui", StaticFiles(directory="app/static"), name="ui")

@app.get("/")
def serve_ui():
    return FileResponse("app/static/index.html")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/readings")
def add_reading(data: dict, db: Session = Depends(get_db)):
    reading = Reading(
        deviceId=data["deviceId"],
        moisture=data["moisture"],
        soilTemp=data.get("soilTemp"),
        timestamp=datetime.utcnow()
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)

    result = analyze_reading(reading)
    rec = None
    if result:
        rec = Recommendation(
            deviceId=reading.deviceId,
            type=result["type"],
            message=result["message"],
            severity=result["severity"]
        )
        db.add(rec)
        db.commit()

    return {"reading": reading.__dict__, "recommendation": result}

@app.get("/api/devices/{deviceId}/readings")
def get_readings(deviceId: str, db: Session = Depends(get_db)):
    return (
        db.query(Reading)
        .filter(Reading.deviceId == deviceId)
        .order_by(Reading.timestamp.desc())  
        .all()
    )


@app.post("/api/chat")
async def chat(data: dict, db: Session = Depends(get_db)):
    question = data.get("question")
    device_id = data.get("deviceId")

    if not question:
        return {"answer": "Please ask a question."}

    latest = None
    if device_id:
        latest = db.query(Reading).filter(
            Reading.deviceId == device_id
        ).order_by(Reading.timestamp.desc()).first()

    prompt = f"""
You are a soil health assistant.

Latest sensor data:
{latest.__dict__ if latest else "No data"}

User question:
{question}

Give a simple, clear answer.
"""

    try:
        response = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: model.generate_content(prompt).text
        )
        if not response:
            return {"answer": "I could not generate a response."}

        return {"answer": response}

    except Exception as e:
        print("Gemini Error:", e)
        return {"answer": "Chatbot service is currently unavailable."}

