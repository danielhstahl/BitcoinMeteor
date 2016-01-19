// Write your package code here!
QuandlDB=new Mongo.Collection("quandl");

if(Meteor.isServer){
    QuandlDB.rawCollection().ensureIndex({Date:1, DataSet:1}, {unique:true}, function(err){});
    Meteor.methods({
        quandl_auth: function(key){
            quandl.api_key = key;
            return 'success';
        }
    });
}
Quandl=function(){
    var self=this;
    self.api_key="";
    self.url = "https://www.quandl.com/api/v3/datasets";
    //self.column_names=[];
    self.getData=function(url){
        /*var headers = {
			'X-BFX-APIKEY': self.api_key
		};*/
        var data=JSON.parse(HTTP.get(self.url+url+'?api_key='+self.api_key).content).dataset; //does this work async?
        var column_names=data.column_names;
        var dataset=data.dataset_code;
        data=data.data;
        var n=data.length;
        var m=column_names.length;
        for(var i=0; i<n; i++){
            var obj={};
            for(var j=0; j<m;j++){
                obj[column_names[j]]=data[i][j];
            }
            obj.DataSet=dataset;
            QuandlDB.update(obj, obj, {upsert:true});
        }
    }
}
quandl=new Quandl();
console.log("quandl is now available with data base name QuandlDB");