window.onload = function() {
    var app = new Vue({
        el:'#app',
        delimiters: ['${', '}'],
        data:{
            userinput:"",
            showinput : true,
            mode : "ckip",
            output:"",
            newsclassification:["民視","中國時報","公視","中央通訊社","自由時報","PChome","Nownews","三立","Ettoday"],
            ckip_newsarray:[],
            jieba_newsarray:[],
            showoutput : false,
            predictdata : null,
            loading : false
        },
        methods:{
            check:function(){
                if(this.userinput.length!=0)
                    return true;  
            },
            submit:function(){
                if(this.check())
                {
                  axios.post('/predict', {
                    userinput: this.userinput
                  })
                  .then(function (response) {
                    console.log(response.data);
                    app.predictdata = response.data;
                    console.log("mode"+app.mode);
                    app.pdresult();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });  
                }
                else{
                    alert("請輸入內容");
                }
            },
            
            pdresult:function(){
                this.userinput = this.userinput.replace(/\n/g, '<br/>');
                this.sortnews(this.ckip_newsarray,this.predictdata[0]);
                this.sortnews(this.jieba_newsarray,this.predictdata[1]);
            },

            sortnews:function(newsarray,percentagelist){
                for (var i = 0; i < 9; i++) {
                    var newsobject = {
                        newsclass: this.newsclassification[i],
                        possibility: percentagelist[i]
                    };
                    newsarray.push(newsobject);     
                }
                newsarray.sort(function (a, b) {
                        return b.possibility - a.possibility;
                });
            },
            refresh:function(){
                this.userinput = "";
                this.showinput = true;
                this.showoutput = false;
                this.ckip_newsarray = [];
                this.jieba_newsarray = [];
            }
        }
    
    })
    axios.interceptors.request.use(function(config){
        app.loading = true;
        app.showinput = false;
        return config;
    },function(error){   
        return Promise.reject(error);
    });
    axios.interceptors.response.use(function(response){  
        app.loading = false; 
        app.showoutput = true;
        return response;
    },function(error){ 
        return Promise.reject(error);
    });
};

/*
$(document).ready(function(){
  $("#btn").click(function(){
	$(this).off('click');
        userinput = { "userinput" : $('#userinput').val()};
        //alert($("input[name='mode']:checked").val());
        $.ajax({
            data: JSON.stringify(userinput),
            url: '/check',
            dataType: 'json',
            type:'POST',
            cache: false,
            success: function(data)
            {
            $("#inp").css("display","none");
            $("#output").css("display","block");
            mode = $("input[name='mode']:checked").val();
            console.log("data: " + data);
            if(mode == "ckip"){
                data = data[0];}
            else if(mode == "jieba"){
                data = data[1];}
            pdresult(data);
            },
            error:function(jqXHR, textStatus, errorThrown){
            alert('error '+ textStatus+' Thrown');
            }
        });
     });
});

*/