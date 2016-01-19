Keys=new Mongo.Collection("keys");
Links=new Mongo.Collection("links");
//WalletData=new Mongo.Collection("wallet");
Wallets=new Mongo.Collection("wallets");
Allocations=new Mongo.Collection("allocations");

if (Meteor.isClient) {
    Meteor.subscribe('keys');
    Meteor.subscribe('wallets');
    Meteor.subscribe('firstWallet');
    Meteor.subscribe('allocations');
    //Meteor.subscribe('walletData');
    Template['replace_atNavButton'].replaces('atNavButton');
    Template['replace_atTextInput'].replaces('atTextInput');    
}
if (Meteor.isServer) {
    /*WalletData.rawCollection().ensureIndex({owner:1, timestamp:1, balance:1, currency:1}, {unique:true}, function(err){
        console.log(err);
    });*/
    Links.remove({});//probably mroe efficient to simply check if links exist...
    Links.insert({elid:'portfolio', name:'Portfolio', select:true});
    Links.insert({elid:'market', name:'Market', select:false});
    Links.insert({elid:'settings', name:'Settings', select:false});
    var currencies="";
    Meteor.startup(function () {
    // code to run on server at startup
        
        //Meteor.call('quandl_auth', Meteor.settings.quandl_key);
        //currencies=bitfinex.getCurrencies();
    });
    Meteor.publish("links", function(){
        return Links.find({});
    });
    Meteor.publish("keys", function () {
        console.log("got here");
        if(this.userId){
            var keys=Keys.find({owner:this.userId}, {sort:{createdAt: -1}});
            var firstRecord=keys.fetch()[0];
            //console.log()
            //console.log(keys);
            
            Meteor.call('bfx_auth', firstRecord.api_key, firstRecord.api_secret);
            return keys;
        }
        
    });
  
    var conversion={
        btc:{
            usd:'BTCUSD',
            ltc:'LTCBTC',
        },
        usd:{
            btc:'BTCUSD',
            ltc:'LTCUSD'
        },
        ltc:{
            btc:'LTCBTC',
            usd:'LTCUSD'
        }
    }
    Meteor.publish("firstWallet", function(){
        return Wallets.find({owner:this.userId}, {limit:1});
    });
    Meteor.publish("allocations", function(){
        return Allocations.find({owner:this.userId}, {sort: {createdAt: -1}, limit:1});
    });
    Meteor.publish("wallets", function(){

        var owner=this.userId;
        //var currencies=bitfinex.getCurrencies();
       // console.log(owner);
        var getBalances=function(){
            var BTCUSD=bitfinex.getTicker('BTCUSD').last_price;
            var LTCUSD=bitfinex.getTicker('LTCUSD').last_price;
            var LTCBTC=bitfinex.getTicker('LTCBTC').last_price;
            var exchange={
                'btc':{
                    'usd':BTCUSD,
                    'ltc':1/LTCBTC,
                    'btc':1
                },
                'ltc':{
                    'usd':LTCUSD,
                    'ltc':1,
                    'btc':LTCBTC,
                },
                'usd':{
                    'usd':1,
                    'ltc':1/LTCUSD,
                    'btc':1/BTCUSD
                }
            };
            if(bitfinex.isAuthenticated){
                var wallets=bitfinex.getWalletBalances(new Date().getTime());
                var n=wallets.length;
                var currDate=new Date();
                //mostRecentDate=currDate;
                var wallet={};
                for(var i=0; i<n; i++){
                    //wallets[i].owner=owner;
                    //wallets[i].timestamp=currDate;
                    var balance=wallets[i].amount;
                    wallets[i].USDBalance=exchange[wallets[i].currency].usd*balance;
                    wallets[i].LTCBalance=exchange[wallets[i].currency].ltc*balance;
                    wallets[i].BTCBalance=exchange[wallets[i].currency].btc*balance;
                    
                }
                
                wallet.owner=owner;
                wallet.timestamp=currDate;
                wallet.values=wallets;
                Wallets.insert(wallet);
                //console.log(wallets);
                
            }
        }
        getBalances();
        Meteor.setInterval(getBalances, 1000);
        //console.log(Wallets.find({owner:owner}, {sort: {timestamp: -1}, limit:1}).fetch());
        return Wallets.find({owner:owner}, {sort: {timestamp: -1}, limit:1});
        
    });

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
        },
        'allocation':function(allocations){
            Allocations.insert({
                owner:Meteor.userId(),
                createdAt:new Date(),
                allocation:allocations
            });
        },
        
    });
}

