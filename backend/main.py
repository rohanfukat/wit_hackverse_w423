from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import course_details, user_registration
from typing import List, Optional
from google import genai
from db import mapping_collection, user_collection, syllabus_collection, subject_collection
import os,json
from dotenv import load_dotenv
from model import course_details, course_outcome, user_registration, user_login, course_mapping_data, CourseSubmissionData, ExamEvaluationRequest, SubjectData
from pydantic import BaseModel
import pdfplumber
from io import BytesIO
import re
from datetime import datetime
import base64


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
    print("this co po list",co_dict_list)
    # Returning will lead to error because of 
    
    prompt=    """
You are an AI expert in Bloom's Taxonomy and Outcome-Based Education (OBE). 
Given a Course Outcome (CO), classify it based on Bloom's levels and predict its mapping to Program Outcomes (POs). 
The  POS are :-
PO1: Apply engineering knowledge to solve problems, PO2: Analyze and solve complex problems, PO3: Design safe and sustainable solutions.
PO4: Conduct research and analyze data, PO5: Use modern tools effectively, PO6: Assess societal and legal impacts, PO7: Promote environmental sustainability, 
PO8: Follow ethical practices, PO9: Work individually and in teams, PO10: Communicate effectively.
PO11: Manage projects and finances, PO12: Engage in lifelong learning.
Give Rank 1 for low, 2 for medium and 3 for high.
Provide a justification.
Output format:[
  {
    "CO_number": "",
    "CO_Objective": "",
    "Bloom_Level": "",
    "Mapped_POs": [
      {
        "PO": "",
        "Justification": "",
        "Rank": ""
      },...
    ]
  },..
]
"""
    prompt = prompt + f" course outcomes are{co_dict_list}. Give me the data in json object to send it to frontend"
    response = client.models.generate_content(
    model="gemini-2.0-flash", contents=prompt

)
    
    input_string = response.text
    input_string = input_string[7:-4]
    try:
      json_data = json.loads(input_string)
      print(json.dumps(json_data, indent=2))  # Pretty print the JSON
    except json.JSONDecodeError:
      print("The model's output was not valid JSON.")
      print("Raw output:", input_string)
      
    return json_data


@app.post("/register")
async def user_register(user_data : user_registration):
    result = await user_collection.insert_one(user_data.model_dump())
    print(f"Document inserted with id: {result.inserted_id}")
    return {"User Created Successfully "}

@app.post("/login")
async def user_login(form_data: user_login):
    # print(form_data)
    user = await user_collection.find_one({"username":form_data.username})
    # print(user)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    #  if not user or not verify_password(form_data.password, user["hashed_password"]):
    #     raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if user['password'] != form_data.password:
        raise HTTPException(status_code=404, detail="Invalid Credentials")
    
    return {"User Login Successfully"}
   
def convert_mongo_json(data):
    if isinstance(data, list):
        return json.loads(json.dumps(data, default=str))  # Convert list of documents
    elif isinstance(data, dict):
        return json.loads(json.dumps(data, default=str))  # Convert single document
    return data

@app.post("/get_mapping")
async def get_mapping(course_data: course_mapping_data):
    try:
        print(course_data.subject)
        # Fetch all documents with the given subject
        result = mapping_collection.find({"subject": course_data.subject})
        documents = await result.to_list(length=None)  # Retrieve all documents

        if not documents:
            raise HTTPException(status_code=404, detail="No matching documents found.")

        # Convert ObjectId to string
        converted_documents = convert_mongo_json(documents)

        return {"data": converted_documents}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving mapping: {str(e)}")

@app.post("/save_co-po_mapping")
async def register(course_mappings: List[course_outcome]):
    inserted_ids = []
    documents = []

    for course_mapping in course_mappings:
        documents.append(course_mapping.model_dump())

    if documents:
        result = await mapping_collection.insert_many(documents)
        inserted_ids = [str(id) for id in result.inserted_ids] #convert objectIds to strings.
        print(f"Data added : {inserted_ids}")
    else:
        print("No data was provided to insert")

    return {"Data Added": inserted_ids}


@app.post("/save-course-details")
async def save_course_details(course_data: CourseSubmissionData):
    try:
        # Convert the model to a dictionary
        course_dict = course_data.model_dump()
        
        # Insert into MongoDB (assuming you have a collection for course details)
        result = await subject_collection.insert_one(course_dict)
        
        if result.inserted_id:
            return {
                "status": "success",
                "message": "Course details saved successfully",
                "id": str(result.inserted_id)
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to save course details"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving course details: {str(e)}"
        )

@app.post("/evaluate-exam-paper")
async def evaluate_exam_paper(eval_data: ExamEvaluationRequest):
    try:
        print(eval_data.subject)
        # Search for subject in syllabus collection
        subject_data = await subject_collection.find_one({"subject": eval_data.subject})
        print(subject_data)

        if not subject_data:
            raise HTTPException(status_code=404, detail="Subject not found in syllabus")

        # Extract CO details from syllabus
        co_details = subject_data.get("CO_number", [])
        co_descriptions = [f"CO{co['id']}: {co['description']}" for co in co_details]

        # Modified prompt for Gemini to return only CO numbers
        prompt = f"""
You are an AI expert in educational assessment and Course Outcome evaluation.
Given the following information, analyze how each exam question aligns with Course Outcomes:

Course Outcomes:
{json.dumps(co_descriptions, indent=2)}

Exam Questions:
{json.dumps(eval_data.questions, indent=2)}

For each question, determine which Course Outcomes (COs) it aligns with and the strength of that alignment.
Important: In the aligned_COs field, only include the CO numbers (like "CO1", "CO2") without descriptions.

Output format:
{{
    "question_analysis": [
        {{
            "question_text": "<question text>",
            "aligned_COs": ["CO1", "CO2"],  // Only CO numbers, no descriptions
            "alignment_strength": "High"
        }}
    ]
}}

Rules:
1. aligned_COs should only contain CO numbers like "CO1", "CO2", etc.
2. Alignment strength must be one of: "High", "Medium", or "Low"
3. Only include COs that are strongly related to the question
4. Maximum of 3 aligned COs per question

Only include the question_analysis array in the output.
"""

        # Call Gemini API
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        # Process Gemini response
        analysis_text = response.text
        analysis_text = analysis_text.replace("```json", "").replace("```", "").strip()
        
        try:
            analysis_data = json.loads(analysis_text)
            print("Generated Analysis:", json.dumps(analysis_data, indent=2))
            
            # Validate that aligned_COs only contains CO numbers
            for item in analysis_data["question_analysis"]:
                item["aligned_COs"] = [co for co in item["aligned_COs"] 
                                     if isinstance(co, str) and co.startswith("CO")]
            
            return {
                "status": "success",
                "subject": subject_data.get("subject"),
                "analysis": analysis_data["question_analysis"]
            }
        except json.JSONDecodeError as e:
            print("Raw Gemini output:", analysis_text)
            raise HTTPException(
                status_code=500,
                detail="Failed to parse AI analysis"
            )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing evaluation: {str(e)}"
        )

def extract_questions_from_pdf(pdf_bytes):
    questions = []
    
    try:
        with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue  # Skip pages with no text
                
                for line in text.split("\n"):
                    line = line.strip()
                    
                    # Pattern to match question indicators (Q1, Question 1, 1., etc.)
                    if re.match(r'^(?:Q|Question|QUESTION)?\s?\d+[\.\)]?\s', line):
                        question_text = re.sub(r'^(?:Q|Question|QUESTION)?\s?\d+[\.\)]?\s*', '', line)
                        questions.append({
                            "text": question_text,
                            "page": page.page_number
                        })
                    
                    # Alternative pattern for questions starting with bullet points
                    elif re.match(r'^[\•\-\*]\s', line):
                        questions.append({
                            "text": line[2:].strip(),
                            "page": page.page_number
                        })
    
    except Exception as e:
        print(f"Error extracting questions: {str(e)}")
        raise Exception(f"Failed to extract questions: {str(e)}")
        
    return questions

@app.post("/upload-exam-paper")
async def upload_exam_paper(file: UploadFile = File(...)):
    try:
        # Read the PDF file
        contents = await file.read()
        
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )
            
        # Extract questions from the PDF
        questions = extract_questions_from_pdf(contents)
        
        if not questions:
            raise HTTPException(
                status_code=400,
                detail="No questions could be extracted from the PDF"
            )
            
        return {
            "status": "success",
            "message": f"Successfully extracted {len(questions)} questions",
            "questions": questions
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing PDF: {str(e)}"
        )

# Add this model class


# Add these routes
@app.post("/upload-syllabus")
async def upload_syllabus(file: UploadFile = File(...)):
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/syllabus"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"syllabus_{timestamp}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        return {
            "status": "success",
            "filename": unique_filename,
            "message": "Syllabus uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload syllabus: {str(e)}"
        )

class SubjectData(BaseModel):
    subjectName: str
    sem: str
    syllabusContent: str  # Will store the file content as text
    syllabusName: str     # Will store the original filename

@app.post("/add-subject")
async def add_subject(subject_data: SubjectData):
    try:
        # Convert the model to a dictionary
        subject_dict = {
            "subjectName": subject_data.subjectName,
            "sem": subject_data.sem,
            "syllabusContent": subject_data.syllabusContent,  # Store file content as text
            "syllabusName": subject_data.syllabusName,       # Store original filename
            "createdAt": datetime.now()
        }
        
        # Insert into MongoDB
        result = await syllabus_collection.insert_one(subject_dict)
        
        if result.inserted_id:
            return {
                "status": "success",
                "message": "Subject added successfully",
                "id": str(result.inserted_id)
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to add subject"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error adding subject: {str(e)}"
        )
