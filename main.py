import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

# ============================================================
# Load Model
# ============================================================

model = joblib.load("Mental_Health_Model.pkl")


# ============================================================
# Constants
# ============================================================

TOP_COUNTRIES = [
    "India",
    "USA",
    "Canada",
    "Australia",
    "UK",
    "Germany",
    "Mexico",
    "Turkey",
    "France",
]


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="Student Mental Health Prediction API",
    description="API for predicting a student's mental health score.",
    version="1.0.0",
)


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Input Schema
# ============================================================


class StudentData(BaseModel):

    age: int = Field(..., ge=10, le=100)

    gender: Literal[
        "Male",
        "Female",
    ]

    country: str

    academic_level: Literal[
        "Undergraduate",
        "Graduate",
        "High School",
    ]

    most_used_platform: Literal[
        "Instagram",
        "TikTok",
        "Facebook",
        "LinkedIn",
        "YouTube",
        "Twitter",
        "Snapchat",
        "WhatsApp",
        "LINE",
        "VKontakte",
        "KakaoTalk",
        "WeChat",
    ]

    purpose_of_use: Literal[
        "Entertainment",
        "Education",
        "Networking",
        "News",
    ]

    avg_daily_usage_hours: float = Field(
        ...,
        ge=0,
        le=24,
    )

    daily_unlocks: int = Field(
        ...,
        ge=0,
    )

    study_hours: float = Field(
        ...,
        ge=0,
        le=24,
    )

    physical_activity_hours: float = Field(
        ...,
        ge=0,
        le=24,
    )

    sleep_hours_per_night: float = Field(
        ...,
        ge=0,
        le=24,
    )

    stress_level: Literal[
        "Very High",
        "High",
        "Medium",
        "Low",
    ]


# ============================================================
# Output Schema
# ============================================================


class PredictionResponse(BaseModel):

    predicted_mental_health_score: float


# ============================================================
# Home Route
# ============================================================


@app.get("/")
def greet():
    return {"message": "Welcome To Student Health Score Prediction Service"}


# ============================================================
# Prediction Route
# ============================================================


@app.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict(data: StudentData):

    # --------------------------------------------------------
    # Group countries
    # --------------------------------------------------------

    country_group = data.country if data.country in TOP_COUNTRIES else "Other"

    # --------------------------------------------------------
    # Create input DataFrame
    # --------------------------------------------------------

    input_row = pd.DataFrame(
        [
            {
                "Age": data.age,
                "Gender": data.gender,
                "Academic_Level": data.academic_level,
                "Most_Used_Platform": data.most_used_platform,
                "Purpose_Of_Use": data.purpose_of_use,
                "Avg_Daily_Usage_Hours": data.avg_daily_usage_hours,
                "Daily_Unlocks": data.daily_unlocks,
                "Study_Hours": data.study_hours,
                "Physical_Activity_Hours": data.physical_activity_hours,
                "Sleep_Hours_Per_Night": data.sleep_hours_per_night,
                "Stress_Level": data.stress_level,
                "Grouped_Country": country_group,
            }
        ]
    )

    # --------------------------------------------------------
    # Make prediction
    # --------------------------------------------------------

    prediction = model.predict(input_row)[0]

    # --------------------------------------------------------
    # Return response
    # --------------------------------------------------------

    return PredictionResponse(
        predicted_mental_health_score=round(
            float(prediction),
            2,
        )
    )
