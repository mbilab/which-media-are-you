var app = new Vue({
  el:'#app',
  delimiters: ['${', '}'],
  data() {return {
    inputArticle:"",
    showInputContent : true,
    mode : "ckip",
    output:"",
    newsClassification:["民視","中國時報","公視","中央通訊社","自由時報","PChome","Nownews","三立","Ettoday"],
    ckipNewsArray:[],
    jiebaNewsArray:[],
    showOutputContent : false,
    predictedData : null,
    showLoadingContent : false
  }},
  methods: {
    submit:function(){
      if(!this.inputArticle.length)
      {
        alert("請輸入內容");
        return;
      }
      axios.post('/predict', {
        inputArticle: this.inputArticle
      })
      .then(function (response) {
        app.predictedData = response.data;
        app.sortPredictResult();
      })
      .catch(function (error) {
        console.log(error);
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
  }
})
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

/*
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

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
});*/

