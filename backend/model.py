from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Union, Optional


class course_details(BaseModel):
    CO_name: str
    CO_ID : str
    sem : str
    subject : str
   # CO_data : List[Dict[str,Union[str,int]]]
    CO_data : List[str]
    

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

