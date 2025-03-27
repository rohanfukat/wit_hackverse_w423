from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Union, Optional


class course_details(BaseModel):
    CO_name: str
    CO_ID : str
    sem : str
    subject : str
    CO_number : str
    CO_details: str
    Description: str

# class course_outcome(BaseModel):
#     CO_number: str
#     CO_Objective: str
#     Bloom_Level: str
#     Mapped_POs: Optional[List[Dict[str, Union[str, int]]]] = None

