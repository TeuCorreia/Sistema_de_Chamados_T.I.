#import bcrypt
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.routes import clientes, chamados, auth
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"mensagem": "API de Chamados T.I. funcionando!"}

app.include_router(clientes.router)
app.include_router(chamados.router)
app.include_router(auth.router)

#http://127.0.0.1:8000/docs#/