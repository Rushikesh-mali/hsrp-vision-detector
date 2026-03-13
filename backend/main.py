from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import requests
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
API_TOKEN = os.getenv('API_TOKEN')

if not API_TOKEN:
    print("WARNING: API_TOKEN not found in .env file!")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect/")
async def detect_number_plate(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    extracted_text = "No plate detected"
    detected_type = "Unknown / Standard"
    vehicle_body_type = "Unknown Shape"  # NEW: Variable to hold Car/Bike
    box = None

    # --- 1. THE CLOUD API SHORTCUT ---
    try:
        response = requests.post(
            'https://api.platerecognizer.com/v1/plate-reader/',
            data=dict(regions=['in']),
            files=dict(upload=contents),
            headers={'Authorization': f'Token {API_TOKEN}'}
        )
        api_result = response.json()
        
        if api_result.get('results') and len(api_result['results']) > 0:
            best_match = api_result['results'][0]
            extracted_text = best_match['plate'].upper()
            box = best_match['box'] 
            
            # NEW: Extract the vehicle shape from the AI!
            if 'vehicle' in best_match and best_match['vehicle'] and 'type' in best_match['vehicle']:
                raw_type = best_match['vehicle']['type'].lower()
                if raw_type == 'motorcycle':
                    vehicle_body_type = "Two-Wheeler (Bike)"
                elif raw_type in ['sedan', 'suv', 'van', 'pickup']:
                    vehicle_body_type = "Four-Wheeler (Car)"
                elif raw_type in ['truck', 'bus']:
                    vehicle_body_type = "Heavy Commercial Vehicle"
                else:
                    vehicle_body_type = raw_type.title()
            
    except Exception as e:
        print(f"API Error: {e}")
        extracted_text = "API Connection Error"

    # --- 2. LOCALIZED HSRP COLOR DETECTION ---
    if box:
        ymin, ymax = box['ymin'], box['ymax']
        xmin, xmax = box['xmin'], box['xmax']
        
        h, w, _ = img.shape
        ymin, ymax = max(0, ymin - 10), min(h, ymax + 10)
        xmin, xmax = max(0, xmin - 10), min(w, xmax + 10)
        
        plate_crop = img[ymin:ymax, xmin:xmax]
    else:
        plate_crop = img

    hsv_img = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2HSV)
    
    color_ranges = {
        'Private (White)': [([0, 0, 150], [180, 50, 255])],
        'Commercial (Yellow)': [([15, 80, 80], [35, 255, 255])],
        'Electric (Green)': [([36, 40, 40], [85, 255, 255])],
        'Diplomatic (Blue)': [([100, 50, 50], [130, 255, 255])],
        'Rental (Black)': [([0, 0, 0], [180, 255, 100])], 
        'Presidential (Red)': [([0, 100, 100], [10, 255, 255]), ([160, 100, 100], [180, 255, 255])] 
    }
    
    max_pixels = 0
    for vehicle_type, ranges in color_ranges.items():
        total_pixels = 0
        for (lower, upper) in ranges:
            mask = cv2.inRange(hsv_img, np.array(lower), np.array(upper))
            total_pixels += cv2.countNonZero(mask)
        
        if total_pixels > max_pixels and total_pixels > 50: 
            max_pixels = total_pixels
            detected_type = vehicle_type

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

    return {
        "classification": detected_type,  # Plate Color Category
        "vehicle_type": vehicle_body_type, # NEW: Car/Bike Body Shape
        "plate_characters": extracted_text,
        "timestamp": timestamp
    }