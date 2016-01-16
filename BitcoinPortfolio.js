Keys=new Mongo.Collection("keys");
Links=new Mongo.Collection("links");
if (Meteor.isClient) {
    Meteor.subscribe('keys');
    Template['replace_atNavButton'].replaces('atNavButton');
    Template['replace_atTextInput'].replaces('atTextInput');    
}
if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup
        Links.remove({});//probably mroe efficient to simply check if links exist...
        Links.insert({elid:'portfolio', name:'Portfolio', select:true});
        Links.insert({elid:'market', name:'Market', select:false});
        Links.insert({elid:'settings', name:'Settings', select:false});
        Meteor.call('quandl_auth', Meteor.settings.quandl_key);
        
    });
    Meteor.publish("links", function(){
        return Links.find({});
    });
    Meteor.publish("keys", function () {
        console.log("got here");
        var keys=Keys.findOne({owner:this.userId}, {sort: {createdAt: -1}});
        Meteor.call('bfx_auth', keys.api_key, keys.api_secret);
        return Keys.find({owner:this.userId}, {sort: {createdAt: -1}});
        
    });
    Meteor.publish("portfolio_data", function(){
        var data={};
        Meteor.setInterval(function(){
            var btcusd=JSON.parse(quandl.getData('/BCHARTS/BITFINEXUSD.json')).data;
            var ltcusd=JSON.parse(quandl.getData('/BTCE/USDLTC.json')).data;
            var ltcbtc=JSON.parse(quandl.getData('/BTCE/BTCLTC.json')).data;
            data{
                'BTCUSD':
            });
            
        }, 1000*60*60)
        
    });
    Bitfinex.prototype.getSymbols=function(){ //add missing functionality to the Bitfinex pacakge
        var response = HTTP.get(this.url + '/symbols');
		var a = response.data;
		a.timestamp = new Date();
		return response.data;
    }
    console.log(bitfinex.getSymbols());
    //console.log(Meteor.settings);
    
    
    //var authBitfinex=Meteor.bitfinex_auth(quandl_key);
    //console.log(authQuandl);
    Meteor.methods({
        'pushKeys': function(key, secret){
            Keys.insert({
                api_key: key,
                api_secret:secret,
                owner: Meteor.userId(),
                username: Meteor.user().username,
                createdAt: new Date() // current time
            });
            Meteor.call('bfx_auth', key, secret);
        }/*,
        'authenticateBitfinex':function(){
            //var keys=Keys.find({owner:userId}).sort({createdAt: -1}).limit(1);//[0];
            var keys=Keys.findOne({owner:Meteor.userId()}, {sort: {createdAt: -1}});
            console.log(keys);
            if(!keys){
                return false;
            }
            return Meteor.call('bitfinex_auth', keys.api_key, keys.api_secret)==='success';
        }*/
    });
}

