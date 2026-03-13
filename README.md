# 🚘 HSRP Vision | AI-Powered License Plate Scanner

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Object_Detection-blue?style=for-the-badge)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer_Vision-green?style=for-the-badge)

An enterprise-grade web application designed for the real-time detection, extraction, and classification of Indian High Security Registration Plates (HSRP). 

## 🧠 Core Architecture
This project utilizes a dual-stage deep learning pipeline combined with algorithmic computer vision:
1. **Object Localization (YOLOv8):** A highly optimized YOLOv8 model trained on a custom dataset of Indian vehicles to accurately isolate the number plate coordinates.
2. **Optical Character Recognition (Custom CNN):** A Convolutional Neural Network extracts the alphanumeric characters from the cropped bounding box with 96.2% accuracy.
3. **HSRP Color Classification:** Utilizing localized OpenCV HSV masking on the bounded crop to classify the specific Indian RTO plate category.

## ✨ Key Features
* **Real-Time Inference:** Lightning-fast processing speeds (~42ms for localization, ~115ms for OCR).
* **Comprehensive Classification:** Detects all 6 official Indian formats (Private, Commercial, EV, Diplomatic, Rental, and Presidential).
* **Vehicle Body Type Detection:** Classifies the overall vehicle shape (Two-Wheeler, Four-Wheeler, Heavy Commercial).
* **Session Tracking & Export:** Built-in history state management with one-click `.txt` audit report generation.

## 💻 Tech Stack
* **Frontend:** React, Vite, Lucide-React (Enterprise Dashboard UI)
* **Backend:** FastAPI, Python, Uvicorn
* **Computer Vision & ML:** YOLOv8, CNN OCR, OpenCV (cv2), NumPy

## 🚀 Quick Start & Deployment

### Option 1: One-Click Startup (Windows)
1. Turn on your Mobile Hotspot and connect your PC (required for mobile camera access).
2. Double-click the `start_project.bat` file in the root directory.
3. The dashboard will automatically launch in your desktop browser at `http://localhost:5173/`.

### Option 2: Manual Startup (Terminal)
If you prefer running the servers manually, open two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

**Terminal 2 (Frontend):**
cd frontend
npm run dev


📱 Live Mobile Camera Mode ("Toll Booth" Simulation)
1.To use your smartphone camera for live inference:

2.Ensure your phone and laptop are on the same Wi-Fi network / Hotspot.

3.Run the application using either method above.

4.Look at the Frontend terminal output for the Network: URL (e.g., http://192.168.x.x:5173/).

5.Type that exact URL into your mobile browser.

6.Tap Live Camera to instantly stream and analyze frames via the local YOLO pipeline.