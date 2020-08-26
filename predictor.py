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
    jiebaResult = [round(num*100, 2) for num in jieba]
    ckiptaggerResult = (pov.predict(item.userinput,'ckiptagger')).tolist()
    ckiptaggerResult = [round(num*100,2) for num in ckiptagger]
    predictData = [ckiptagger,jieba]
    return predictData

if __name__=="__main__":
    uvicorn.run("predictor:app",host="merry.ee.ncku.edu.tw", port=16664)
