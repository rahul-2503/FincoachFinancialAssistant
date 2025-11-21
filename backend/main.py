# backend/main.py
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from beanie import PydanticObjectId

from .db import init_db  # this handles .env loading now
from .models import Transaction, TransactionCreate, Summary

# ✅ no more load_dotenv() here, db.py does it already

app = FastAPI(
    title="FinCoach API",
    description="API for managing personal finance transactions.",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*",  # allow all during dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    print("✅ Starting up and initializing DB...")
    await init_db()


@app.get("/")
def root():
    return {"message": "FinCoach backend is running!"}


@app.get("/transactions", response_model=List[Transaction])
async def get_all_transactions():
    transactions = await Transaction.find_all().to_list()
    return transactions


@app.post("/add_transaction", response_model=Transaction, status_code=status.HTTP_201_CREATED)
async def add_transaction(transaction_data: TransactionCreate):
    txn = Transaction(
        description=transaction_data.description,
        amount=transaction_data.amount,
        type=transaction_data.type.lower(),
        category=transaction_data.category,
    )
    await txn.insert()
    return txn


@app.delete("/delete_transaction/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: PydanticObjectId):
    txn = await Transaction.get(transaction_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    await txn.delete()
    return None


@app.get("/summary", response_model=Summary)
async def get_summary():
    txns = await Transaction.find_all().to_list()
    total_income = sum(t.amount for t in txns if t.type == "income")
    total_expense = sum(t.amount for t in txns if t.type == "expense")
    return Summary(income=total_income, expense=total_expense, balance=total_income - total_expense)
