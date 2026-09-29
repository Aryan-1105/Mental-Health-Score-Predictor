# 🧠 Mental Health Score Predictor

A Machine Learning web application that predicts a student's mental health score based on social media usage, study habits, sleep, physical activity, and stress level.

## 🚀 Features

- Machine Learning regression model
- FastAPI backend
- HTML/CSS/JavaScript frontend
- REST API for predictions
- Pydantic data validation
- CORS support
- Interactive prediction interface

## 📊 Input Features

The model uses the following features:

- Age
- Gender
- Country
- Academic Level
- Most Used Platform
- Purpose of Use
- Daily Social Media Usage
- Daily Unlocks
- Study Hours Per Day
- Physical Activity Hours Per Day
- Sleep Hours Per Night
- Stress Level

## 🤖 Machine Learning

This project uses a trained regression model stored in:

`Mental_Health_Model.pkl`

The model predicts a continuous Mental Health Score.

## 🛠️ Tech Stack

### Machine Learning
- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-learn
- Joblib

### Backend
- FastAPI
- Pydantic
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript

## 📁 Project Structure

```text
Mental_Health_Score/
│
├── data/
│   └── Mental_Health_Score.csv
│
├── index.html
├── style.css
├── script.js
├── main.py
├── Mental_Health_Model.pkl
├── requirements.txt
├── README.md
└── .gitignore