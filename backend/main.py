from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import os

# --- Configuration ---
# Use environment variables for sensitive info. Never hardcode secrets!
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./alice_cafe.db")
# In production, use a secure API key or proper OAuth2/JWT tokens
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "dev-secret-key")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Models ---
class InquiryDB(Base):
    __tablename__ = "inquiries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String)
    phone = Column(String, nullable=True)
    subject = Column(String)
    message = Column(Text)
    created_at = Column(String)

class ApplicationDB(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    email = Column(String)
    phone = Column(String)
    experience = Column(String)
    message = Column(Text)
    created_at = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas (for API validation) ---
class InquiryCreate(BaseModel):
    name: str
    email: str
    phone: str = None
    subject: str
    message: str

class ApplicationCreate(BaseModel):
    name: str
    age: int
    email: str
    phone: str
    experience: str
    message: str

# --- FastAPI App ---
app = FastAPI()

# Allow CORS
# Security: Restricted to specific trusted origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["X-API-Key", "Content-Type"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Magical Cafe ALICE Backend is running!"}

# Submit Inquiry
@app.post("/api/inquiries")
def create_inquiry(inquiry: InquiryCreate, db: Session = Depends(get_db)):
    # Note: SQLAlchemy ORM handles SQL injection protection by using parameter binding
    db_item = InquiryDB(
        name=inquiry.name,
        email=inquiry.email,
        phone=inquiry.phone,
        subject=inquiry.subject,
        message=inquiry.message,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_item)
    db.commit()
    return {"status": "success", "message": "Inquiry submitted successfully"}

# Submit Application
@app.post("/api/applications")
def create_application(app_data: ApplicationCreate, db: Session = Depends(get_db)):
    db_item = ApplicationDB(
        name=app_data.name,
        age=app_data.age,
        email=app_data.email,
        phone=app_data.phone,
        experience=app_data.experience,
        message=app_data.message,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_item)
    db.commit()
    return {"status": "success", "message": "Application submitted successfully"}

# Get All Data (For Admin)
@app.get("/api/admin/data")
def get_admin_data(x_api_key: str = Header(None), db: Session = Depends(get_db)):
    if x_api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized access")
    
    inquiries = db.query(InquiryDB).order_by(InquiryDB.id.desc()).all()
    applications = db.query(ApplicationDB).order_by(ApplicationDB.id.desc()).all()
    
    return {
        "inquiries": inquiries,
        "applications": applications
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
