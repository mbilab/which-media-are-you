#coding=utf-8
#!/usr/bin/env python


# standard import
import re
import sys

# third-party import
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import pickle

# local import
from preprocessor import preprocessor


def predict(article, segment_type):
    with open('./pickle/clf.pickle', 'rb') as f:
        clf = pickle.load(f)

    x_test = preprocessor(article, segment_type)
    y_pred_proba = clf.predict_proba(x_test)
    return y_pred_proba[0]

if '__main__' == __name__:
    print(predict('我愛中國', 'jieba'))
