# backend/models.py
from beanie import Document
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Transaction(Document):
    description: str
    amount: float
    type: str          # stored as "income" or "expense"
    category: str
    date: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "transactions"

class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: str         # frontend sends "Income" or "Expense"
    category: str

class TransactionOut(BaseModel):
    id: str
    description: str
    amount: float
    type: str
    category: str
    date: datetime

class Summary(BaseModel):
    income: float
    expense: float
    balance: float
