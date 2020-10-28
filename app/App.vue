<template lang="pug">

#app
  .header Which media are you ?
  div(v-show='showInputContent')
    .main
      label.msg(for='inputArticle') 請輸入文章 : 
      keep-alive
        textarea#inputArticle(name='inputArticle', rows='9', style='width: 100%;', placeholder='請輸入內文', v-model='inputArticle')
      .btnmsg Method&nbsp;&nbsp;
        input#ckip(type='radio', name='mode', value='ckip', v-model='mode')
        label(for='ckip')  CKIPtagger&nbsp;
        input#jieba(type='radio',class="ui button", name='mode', value='jieba', v-model='mode')
        label(for='jieba') Jieba
      input.btn(type='button',class="ui right floated button",value='確定',style='font-size:18px; padding:8px;color:black;', @click='submit')
  #loadingmsg(v-show='showLoadingContent', style='display: none;') PLEASE WAIT
  .main(v-show='showOutputContent', style='display: none;')
    .table(v-show="mode === 'ckip' ", v-for='(news) in ckipNewsArray')
      span.bartext  {{news.classification}} : {{news.possibility}}% 
      span.barspan
        span.bar(v-bind:style="{width: (news.possibility/ckipNewsArray[0].possibility)*100 + '%'}")
    .table(v-show="mode === 'jieba' ", v-for='(news) in jiebaNewsArray')
      span.bartext  {{news.classification}} : {{news.possibility}}% 
      span.barspan
        span.bar(v-bind:style="{width: (news.possibility/jiebaNewsArray[0].possibility)*100 + '%'}")
    div(style='text-align: center;margin:10px 0px ;')
      .btnmsg
        input#ckip_btn(type='radio', name='rmode', v-model='mode', value='ckip')
        label(for='ckip_btn')  CKIPtagger&nbsp;
        input#jieba_btn(type='radio', name='rmode', v-model='mode', value='jieba')
        label(for='jieba_btn')  Jieba
      input.btn(type='button',class="ui right floated button",value='重新測試',style='font-size:18px; padding:8px;color:black;' @click='refresh')
    #news_article 您的輸入 : 
      span(v-html='inputArticle')

</template>

<script>
export default {
  data() {return {
    inputArticle : "",
    showInputContent : true,
    mode : 'ckip',
    output :"",
    newsClassification:["民視","中國時報","公視","中央通訊社","自由時報","PChome","Nownews","三立","Ettoday"],
    ckipNewsArray : [],
    jiebaNewsArray : [],
    showOutputContent : false,
    predictedData : null,
    showLoadingContent : false,
    fastapiPort : null,
    host : null,
    fastapiUrl : null

  }},
  methods: {    
    submit:function(){
      if(!this.inputArticle.length)
      {
        alert("請輸入內容");
        return;
      }
      var self = this;
      axios.post(`http://${this.fastapiUrl}`, {
        inputArticle: this.inputArticle,
      })
      .then(function (response) {
        self.predictedData = response.data;
        self.sortPredictResult();
      })
      .catch(function (error) {
        alert("oops");
        console.log(error);
        return;
      });
    },
    
    sortPredictResult:function(){
      this.inputArticle = this.inputArticle.replace(/\n/g, '<br/>');
      this.sortNews(this.ckipNewsArray,this.predictedData[0]);
      this.sortNews(this.jiebaNewsArray,this.predictedData[1]);
    },

    sortNews:function(newsArray,newsPercentage){
      for (var i = 0; i < 9; i++) {
        var newsObject = {
          classification: this.newsClassification[i],
          possibility: newsPercentage[i]
        };
        newsArray.push(newsObject);     
      }
      newsArray.sort(function (a, b) {
        return b.possibility - a.possibility;
      });
    },
    refresh:function(){
      this.inputArticle = "";
      this.showInputContent = true;
      this.showOutputContent = false;
      this.ckipNewsArray = [];
      this.jiebaNewsArray = [];
    }
  },
  mounted:function(){
    this.fastapiUrl = `merry.ee.ncku.edu.tw:${process.env.fastapi_port}/predict`
    var app = this;
    axios.interceptors.request.use(function(config){
    app.showLoadingContent = true;
    app.showInputContent = false;
    return config;
    },function(error){   
        return Promise.reject(error);
    });
    axios.interceptors.response.use(function(response){  
      app.showLoadingContent = false; 
      app.showOutputContent = true;
      return response;
    },function(error){ 
        return Promise.reject(error);
    });
  }
}
</script>

<style>
  #app{
  margin:0px;
  background: #5C9EAD;
  height:100%;
  }
  #loadingmsg{
  font-size: 65px;
  text-align: center;
  font-family: monospace, Courier, monospace;
  font-weight: bolder;
  padding: 130px;
  text-shadow: azure;
  }
  #news_article{
  font-size:16px;
  text-align:left;
  color:black ;
  background-color:lightblue ;
  word-break: break-word;
  border: 1px solid darkgrey;
  border-radius: 3px; padding: 2px;
  }
  #outputform form{
  font-weight: bold;
  margin: 10px 5px 2px 2px;
  font-size:18px;
  }
  .bar{
  float: left;
  height:24px;
  background-color: lightskyblue;
  border: 0px;
  border-color: firebrick;
  margin: 0px;
  padding: 0px;
  }
  .bartext{
  text-align: center;
  font-size: 18px;
  margin:0px 0px;
  padding:2px;
  background-color:#fff;
  width: 28%;
  display: inline-block;
  }
  .barspan{
  padding: 0px 0px;
  float: right;
  width: 69%;
  }
  .btn{
  background-color: #e7e7e7;
  color:black;
  }
  .btnmsg{
  font-weight: bold;
  margin: 6px 2px;
  font-size:22px;
  display:inline-block;
  text-align: center;
  }
  .header{
  top: 0px;
  color: #EEEEEE;
  font-size:38px;
  font-style: oblique;
  font-weight: bold;
  background-color: #326273 ;
  padding:12px;
  text-align: center;
  }
  .main{
  padding: 80px 0px;
  width:640px;
  margin-left: auto;
  margin-right: auto;
  }
  .msg{
  margin:10px 2px;
  display:block;
  font-size:20px;
  font-weight:bold;
  color:black;
  }
  .table{
  text-align: left;
  border: 1px solid grey;
  margin:0px 0px;
  padding:10px;
  background-color:#fff;
  }

</style>


