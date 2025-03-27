from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Union, Optional


class course_details(BaseModel):
    CO_name: str
    CO_ID : str
    sem : str
    subject : str
   # CO_data : List[Dict[str,Union[str,int]]]
    CO_data : List[str]

class SubjectData(BaseModel):
    subjectName: str
    sem: str
    syllabusFile: Optional[str] = None

class ExamEvaluationRequest(BaseModel):
    subject:str
    questions:List[dict]


class CourseOutcomeDetail(BaseModel):
    id: int
    description: str

class CourseSubmissionData(BaseModel):
    CO_name: str
    CO_ID: str
    sem: str
    subject: str
    CO_number: List[CourseOutcomeDetail]
    

class user_registration(BaseModel):
    username:str
    institution : str
    password:str

class user_login(BaseModel):
    username:str
    password: str


class course_outcome(BaseModel):
    subject:str
    CO_number: str
    CO_Objective: str
    Bloom_Level: str
    Mapped_POs: Optional[List[Dict[str, Union[str, int]]]] = None

class course_mapping_data(BaseModel):
    subject : str

