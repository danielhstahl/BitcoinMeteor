/*var wsUrl='wss://api2.bitfinex.com:3000/ws';
if(Meteor.isServer){
    var socket=io(wsURL);
    socket.on('connect', function(){
        
    })
    
    
    startWS=function(callback){
        socket=new WebSocket(wsUrl);
        socket.on('open', loginWS);
        socket.on('message', function(msg){
            //var data=JSON.parse(msg);
            //console.log(data);
            if(data.event){
                if(data.pair){
                    self.connections[data.chanId]=data;
                }
                else if(data.event==='auth'){
                    self.loginInformation=data;
                    var n=self.symbols.length;
                    for(var i=0; i<n; i++){
                        self.getWSTicker(self.symbols[i]);
                    }
                }
            }
            else if(callback){
                callback(data, self.socket);
            }
        });
    };
    
    function(pair){
        socket.send(JSON.stringify({
            "event": "subscribe",
            "channel": "ticker",
            "pair": pair
        }));  
    }
}

function loginWS(){
    var payload = 'AUTH' + (new Date().getTime());
    var signature = crypto.createHmac("sha384", Mongo.Keys.find({})).update(payload).digest('hex'); 
    self.socket.send(JSON.stringify({
        event: "auth",
        apiKey: api_key,
        authSig: signature,
        authPayload: payload
    }));  
};*/