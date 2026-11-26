import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native'; 
// If using React (Web): Replace imports above with standard HTML elements

const API_URL = 'http://127.0.0.1:5000/api/predict_irrigation'; 
// ⚠️ IMPORTANT: For mobile testing, use your machine's local IP address (e.g., http://192.168.1.5:5000)

const SmartAquaCropApp = () => {
    const [soilMoisture, setSoilMoisture] = useState('');
    const [weatherForecast, setWeatherForecast] = useState(''); // mm of rain expected
    const [cropType, setCropType] = useState('Corn'); // Placeholder
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handlePredict = async () => {
        if (!soilMoisture || !weatherForecast || !cropType) {
            Alert.alert("Missing Data", "Please enter all required information.");
            return;
        }

        setLoading(true);
        setPrediction(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    soil_moisture: soilMoisture,
                    weather_forecast_mm: weatherForecast,
                    crop_type: cropType,
                    stage: 'Vegetative', // Assume default stage
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setPrediction(data);
            } else {
                Alert.alert("Prediction Error", data.error || "Failed to get recommendation.");
            }

        } catch (error) {
            console.error("API Call Failed:", error);
            Alert.alert("Connection Error", "Could not connect to the AI prediction server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌱 SmartAquaCrop AI</Text>
            <Text style={styles.subtitle}>Optimal Irrigation Prediction</Text>

            {/* --- Input Fields --- */}
            <TextInput
                style={styles.input}
                placeholder="Current Soil Moisture (%)"
                keyboardType="numeric"
                value={soilMoisture}
                onChangeText={setSoilMoisture}
            />
             <TextInput
                style={styles.input}
                placeholder={`Weather Forecast (mm of rain in 24h)`}
                keyboardType="numeric"
                value={weatherForecast}
                onChangeText={setWeatherForecast}
            />
            {/* Ideally, Crop Type would be a Picker/Dropdown */}
            <Text style={styles.label}>Crop Type: {cropType}</Text> 
            
            {/* --- Prediction Button --- */}
            <Button
                title={loading ? "Calculating..." : "Get Irrigation Needs"}
                onPress={handlePredict}
                disabled={loading}
            />
            
            {/* --- Output Display --- */}
            {prediction && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultHeader}>Irrigation Recommendation:</Text>
                    <Text style={styles.resultValue}>
                        {prediction.prediction_value} {prediction.unit}
                    </Text>
                    <Text style={styles.resultMessage}>{prediction.message}</Text>
                </View>
            )}
            
            {loading && <ActivityIndicator size="large" color="#00aa00" style={{ marginTop: 20 }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0fff0', // Light green background for agriculture theme
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#004d40', // Dark green title
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 15,
    },
    resultContainer: {
        marginTop: 40,
        padding: 20,
        backgroundColor: '#e6ffe6', // Lighter green for results
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#00aa00',
    },
    resultHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#004d40',
    },
    resultValue: {
        fontSize: 32,
        fontWeight: 'extrabold',
        color: '#00aa00',
    },
    resultMessage: {
        marginTop: 10,
        fontSize: 14,
        color: '#333',
    }
});

export default SmartAquaCropApp;