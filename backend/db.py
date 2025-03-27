import motor.motor_asyncio

MONGODB_URL = "mongodb://localhost:27017"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client["CO-PO"]

subject_collection = db["Subject_information"]
user_collection = db["User Information"]
syllabus_collection = db["Syllabus Information"]
mapping_collection = db["CO_PO_Mapping"]