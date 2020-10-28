equirement

* python >= 3.6.9

# Setup

Create your own virtual environment, then install all the required packages.

```sh
virtualenv -p python3 'venv name'
source 'venv name'/bin/activate
pip3 install -r requirements.txt
yarn
```

Make symbolic links for the big folders, which are not in main directory.

```sh
ln -s /home/tintin/predictor/model
ln -s /home/tintin/predictor/pickle
```

# Command-line usage

Specify `text` and `segmentation_type`.  Call `predict()` to get the probabilities of media.

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

1.  Run frontend `./app/index.pug` and fastapi `predictor.py` concurrently with the following command line. You need to replace the ports with yours.
```
frontend_port=[frontend_port] fastapi_port=[fastapi_port] npm run web
```

2. Open the website on `[host]:[frontend port]` with your browser.
