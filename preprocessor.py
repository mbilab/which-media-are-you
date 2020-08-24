#!/usr/bin/env python


# standard import
import sys

# third-party import
import jieba
import pickle
from ckiptagger import WS
from sklearn import feature_extraction
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer


def preprocessor(article, segment_type):

    x = []
    corpus = []

    jieba.load_userdict('./jieba_dict/dict.txt.big')
    stopword_set = set()
    with open('./jieba_dict/stopwords.txt', 'r', encoding = 'utf-8') as stopwords:
        for stopword in stopwords:
            stopword_set.add(stopword.strip('\n'))
        stopword_set.add('\n')

    # use jieba
    if 'jieba' == segment_type:
        seg_list = jieba.cut(article, cut_all = False) # type(seg_list) = generator

    # use ckiptagger_ws
    if 'ckiptagger' == segment_type:
        ws = WS('./model')
        seg_list = ws([article])[0] # type(seg_list) = list

    # remove stopword from seg_list
    #! seg_list  = [word for word in seg_list if word not in stopword_set]
    res = []
    for word in seg_list:
        if word not in stopword_set:
            res.append(word)
    text = ' '.join(res)
    corpus.append(text)

    # load feature.pickle & tfidftransform.pickle for testing data
    # make sure the form of training data and testing data are the same
    vectorizer = CountVectorizer(decode_error='replace', vocabulary=pickle.load(open('./pickle/feature.pickle', 'rb')))
    tfidftransformer = pickle.load(open('./pickle/tfidftransformer.pickle', 'rb'))
    sc = pickle.load(open('./pickle/sc_transformer.pickle', 'rb'))

    tfidf = tfidftransformer.transform(vectorizer.transform(corpus))
    words = vectorizer.get_feature_names()
    weight = tfidf.toarray()

    for i in range(len(weight)):
        x.append(weight[i])

    return sc.transform(x)
