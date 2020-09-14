from fastapi import FastAPI, Request
from pydantic import Json,BaseModel
import uvicorn, json
import pov
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

with open('config.json') as config_file:
    config = json.load(config_file)
    host = config['host']
    fastapiPort = config['fastapi_port']
    frontendUrl = config['host']+":"+str(config['frontend_port'])

origins = [
    "http://" + frontendUrl,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    inputArticle:str

@app.post("/predict")
async def predict(item:Item):
    jiebaResult = (pov.predict(item.inputArticle,'jieba')).tolist()
    jiebaResult = [round(num*100, 2) for num in jiebaResult]
    ckiptaggerResult = (pov.predict(item.inputArticle,'ckiptagger')).tolist()
    ckiptaggerResult = [round(num*100,2) for num in ckiptaggerResult]
    predictData = [ckiptaggerResult,jiebaResult]
    return predictData

if __name__=="__main__":
    uvicorn.run("predictor:app",host=host, port=fastapiPort)