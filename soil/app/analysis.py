from datetime import datetime

def analyze_reading(reading):
    m = reading.moisture
    t = reading.ambientTemp

    if m < 30 and t and t > 35:
        return {
            "type": "irrigation",
            "message": "Soil is very dry and temperature is high. Immediate irrigation required.",
            "severity": "high"
        }

    if m < 30:
        return {
            "type": "irrigation",
            "message": "Soil moisture is low. Irrigation recommended.",
            "severity": "medium"
        }

    if m > 85:
        return {
            "type": "drainage",
            "message": "Soil moisture too high. Stop watering.",
            "severity": "medium"
        }

    return None
