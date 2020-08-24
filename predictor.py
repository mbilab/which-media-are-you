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
    userinput:str

@app.post("/predict")
async def predict(item:Item):
    jieba = (pov.predict(item.userinput,'jieba')).tolist()
    jieba = [round(num*100, 2) for num in jieba]
    ckiptagger = (pov.predict(item.userinput,'ckiptagger')).tolist()
    ckiptagger = [round(num*100,2) for num in ckiptagger]
    predictdata = [ckiptagger,jieba]
    #predictdata = [[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8],[0,0.11,0.22,0.33,0.44,0.55,0.66,0.77,0.88]]
    #time.sleep(3)
    return predictdata

if __name__=="__main__":
    uvicorn.run("predictor:app",host="merry.ee.ncku.edu.tw", port=16664)
 #   uvicorn.run("predictor:app", port=16663)
    
