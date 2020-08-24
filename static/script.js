window.onload = function() {
    var inputform = new Vue({
        el:'#inputform',
        delimiters: ['${', '}'],
        data:{
            userinput:"",
            showinput : true,
            mode : "ckip"
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
                    outputform.predictdata = response.data;
                    console.log("mode"+inputform.mode);
                    outputform.rmode = inputform.mode;
                    outputform.userinput = inputform.userinput;
                    outputform.pdresult();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });  
                }
                else{
                    alert("請輸入內容");
                }
            }
        },
        computed:{
    
        },
    
    })
    var outputform = new Vue({
        el:'#outputform',
        delimiters: ['${', '}'],
        data:{
            output:"",
            newsclassification:["民視","中國時報","公視","中央通訊社","自由時報","PChome","Nownews","三立","Ettoday"],
            ckip_newsarray:[],
            jieba_newsarray:[],
            showoutput : false,
            predictdata : null,
            rmode : "",
            userinput :""
        },
        methods:{
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
                inputform.userinput = "";
                inputform.showinput = true;
                outputform.showoutput = false;
                this.ckip_newsarray = [];
                this.jieba_newsarray = [];
            }
        },
        computed:{
    
        },
    
    })
    var load = new Vue({
        el:'#load',
        delimiters: ['${', '}'],
        data:{
            loading : false,
        }
    })

    axios.interceptors.request.use(function(config){
        load.loading = true;
        inputform.showinput = false;
        return config;
    },function(error){   
        return Promise.reject(error);
    });
    axios.interceptors.response.use(function(response){  
        load.loading = false; 
        outputform.showoutput = true;
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
