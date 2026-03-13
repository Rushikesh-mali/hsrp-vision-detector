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

## 🚀 Quick Start
To launch the entire application stack (Frontend UI + Python Backend) locally:

1. Clone the repository.
2. Install Python dependencies: `cd backend && pip install -r requirements.txt` *(Note: requires `.env` configuration)*
3. Install Node dependencies: `cd frontend && npm install`
4. Run the automated startup script from the root directory:
```bash
./start_project.bat