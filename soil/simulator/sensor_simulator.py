import asyncio, random, httpx
from datetime import datetime

URL = "http://127.0.0.1:8000/api/readings"

async def main():
    moisture = 25
    while True:
        moisture += random.uniform(-8, 8)
        moisture = max(0, min(100, moisture))

        payload = {
            "deviceId": "demo-001",
            "moisture": round(moisture, 2),
            "soilTemp": round(22 + random.uniform(-2, 2), 2)
        }

        async with httpx.AsyncClient() as client:
            r = await client.post(URL, json=payload)
            print(r.json())

        await asyncio.sleep(10)

asyncio.run(main())