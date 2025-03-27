from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import course_details
from typing import List
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

SECRET_KEY = os.getenv("API_KEY")
app = FastAPI()

client = genai.Client(api_key=SECRET_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],  # specific frontend ka URL de sakte ho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test")
def test():
    return {"welcome"}

@app.post("/course_data")
def course_data(course_data : course_details):
    co_dict_list = [{f"CO{i + 1}": course_data.CO_data[i]} for i in range(len(course_data.CO_data))]
    
    # Update the CO_data to the list of dictionaries
    course_data.CO_data = co_dict_list
    
    # Returning will lead to error because of 
#     response = client.models.generate_content(
#     model="gemini-2.0-flash", contents=
#     """
# You are an AI expert in Bloom’s Taxonomy and Outcome-Based Education (OBE). 
# Given a Course Outcome (CO), classify it based on Bloom’s levels and predict its mapping to Program Outcomes (POs). 
# The  POS are :-
# PO1: Apply engineering knowledge to solve problems, PO2: Analyze and solve complex problems, PO3: Design safe and sustainable solutions.
# PO4: Conduct research and analyze data, PO5: Use modern tools effectively, PO6: Assess societal and legal impacts, PO7: Promote environmental sustainability, 
# PO8: Follow ethical practices, PO9: Work individually and in teams, PO10: Communicate effectively.
# PO11: Manage projects and finances, PO12: Engage in lifelong learning.
# Give Rank 1 for low, 2 for medium and 3 for high.
# Provide a justification.
# 1. Comprehend basics of data analytics and visualization. 
# 2. Apply various regression models on given data set and perform prediction.
# Output format:[
#   {
#     "CO_number": "",
#     "CO_Objective": "",
#     "Bloom_Level": "",
#     "Mapped_POs": [
#       {
#         "PO": "",
#         "Justification": "",
#         "Rank": ""
#       },...
#     ]
#   },..
# ]
# """
# )
#     return response.text