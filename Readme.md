# Requirement

* python 3.6.9

# Setup

Create your own virtual environment, then install all the required packages.
```python
virtualenv -p python3 'venv name' 
source 'venv name'/bin/activate 
pip3 install -r requirements.txt
```

# Usage 1 : Predict articles in Python

Input your article and the text segmentation you want to use, then it will output the probability of the classification result.
1-民視，2-中國時報，3-公視，4-中央通訊社，5-自由時報，6-PChome，7-Nownews，8-三立，9-Ettoday

Example:
* Create `test.py` and write the following code.
 
```python
from predictor import pov.py
article = [article to be predicted]
segment_type = [segment_type] #  jieba or ckiptagger
print(predict(article, segment_type)) 
```
* Compile `test.py`.

```
$ python test.py
```
output:
```
[0.11421281 0.12740344 0.10493702 0.10435487 0.12456657 0.11950728 0.111482 0.10811266 0.08542336]
```
# Usage 2 : Put the result on the website

* Edit `predictor.py`.
<br>You should replace the host and the port with your own.
```python
uvicorn.run("predictor:app",host="merry.ee.ncku.edu.tw", port=16664) 
#  uvicorn.run("predictor:app",host=[host], port=[port])
```

* Compile `predictor.py`.
```
$ python predictor.py
```
Then you can setup the website on `[host]:[port]`.