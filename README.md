# Requirement

* python 3.6.9

# Setup

Create your own virtual environment, then install all the required packages.

```python
virtualenv -p python3 'venv name' 
source 'venv name'/bin/activate 
pip3 install -r requirements.txt
```
```
npm i
```

Make symbolic links for the big folders which are not in main directory.
```
ln -s /home/tintin/predictor/pickle
ln -s /home/tintin/predictor/model
```

# Command-line usage

Specify `text` and `segmentation_type`, then `predict()` will output the corresponding probabilities of media.

Example:

1. Create `test.py` and write the following code.
 
```python
from predict import pov.py

text = [text to be predicted]
segmentation_type = [segmentation type] #  'jieba' or 'ckiptagger'
print(predict(text, segmentation_type)) 
```

2. Run `test.py` and you will see an output like

```
[0.11421281 0.12740344 0.10493702 0.10435487 0.12456657 0.11950728 0.111482 0.10811266 0.08542336]
```

The output represents the probabilities of [民視 中國時報 公視 中央通訊社 自由時報 PChome Nownews 三立 Ettoday].

# Web usage

1. Edit `config.json`, replace the value of `"fastapi_port"` and `"frontend_port"` with your own ports.
```
{
  "host" : "merry.ee.ncku.edu.tw",
  "fastapi_port" : [port for fastapi],
  "frontend_port" : [port for frontend]
}
```
2. Run parcel to open  `app/index.pug` in browser and then run `predictor.py`. Note that, `[port for frontend]` here should be same as what in `config.json`.

```
npx parcel ./app/index.pug --port [port for frontend]
python predictor.py
```

2. Open the website on `[host]:[port for frontend]` with your browser.
