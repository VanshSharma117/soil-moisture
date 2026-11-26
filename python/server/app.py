import pandas as pd
import joblib
from flask import Flask, request, jsonify

# --- AI Model Setup ---
# ⚠️ Replace 'model.pkl' with your actual trained model file
try:
    MODEL = joblib.load('ai_models/irrigation_predictor.pkl') 
except FileNotFoundError:
    # This is a placeholder for development without a real model file
    MODEL = None 
    print("Warning: AI model file not found. Using placeholder prediction.")

app = Flask(__name__)

@app.route('/api/predict_irrigation', methods=['POST'])
def predict_irrigation():
    """Receives data from the app and returns an irrigation recommendation."""
    
    data = request.json
    
    # 1. Input Validation and Conversion
    required_keys = ['soil_moisture', 'weather_forecast_mm', 'crop_type', 'stage']
    if not all(k in data for k in required_keys):
        return jsonify({"error": "Missing required data fields."}), 400

    # Assume a simple structure for prediction input (features)
    features = pd.DataFrame([{
        'soil_moisture': float(data['soil_moisture']),
        'temperature': float(data.get('temperature', 25)), # Default temp if not provided
        'precipitation_24h': float(data['weather_forecast_mm']),
        'crop_type_encoded': data['crop_type'], # This would need proper encoding
        # ... add more encoded features for stage, location, etc.
    }])
    
    # 2. Prediction Logic
    try:
        if MODEL:
            # Example: Predict volume (Liters/Hectare) or duration (Minutes)
            prediction = MODEL.predict(features)[0]
        else:
            # Placeholder/Dummy Logic if model is missing (for testing)
            # Higher prediction for dry soil or high temperature
            moisture = features['soil_moisture'].iloc[0]
            temp = features['temperature'].iloc[0]
            prediction = (1000 - moisture * 5) + (temp * 10) # Dummy calculation
            
        
        # 3. Format and Return Output
        recommendation = {
            "prediction_value": max(0, round(prediction, 2)), # Ensure prediction is not negative
            "unit": "Liters/SqMeter",
            "message": "Optimal irrigation needed for the next 48 hours."
        }
        
        return jsonify(recommendation)

    except Exception as e:
        app.logger.error(f"Prediction failed: {e}")
        return jsonify({"error": "Internal server error during prediction."}), 500

if __name__ == '__main__':
    # Run the server on http://127.0.0.1:5000/
    app.run(debug=True)