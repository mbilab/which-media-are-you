from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from pydantic import Json,BaseModel
from fastapi.staticfiles import StaticFiles
import uvicorn
import pov

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def mainhtml(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

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
    uvicorn.run("predictor:app",host="merry.ee.ncku.edu.tw", port=16664)
