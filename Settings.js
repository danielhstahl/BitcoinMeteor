if(Meteor.isClient){
    var allocations=[
        {name:'usd', label:'Cash Percentage'},
        {name:'btc', label:'BTC Percentage'},
        {name:'ltc', label:'LTC Percentage'}
    ];
    /*var allocations={
        'usd':{label:'Cash Percentage'},
        'btc': {label:'BTC Percentage'},
        'ltc': {label:'LTC Percentage'}
    };*/
    /*Session.set('usd', {label:'Cash Percentage'});
    Session.set('btc', {label:'BTC Percentage'});
    Session.set('ltc', {label:'LTC Percentage'});*/
    Template.settings.events({
        "submit #add-api-keys": function (event) {
      // Prevent default browser form submit
            event.preventDefault();
            var api_key = event.target[0].value;
            var api_secret = event.target[1].value;
            event.target[0].value = "";
            event.target[1].value = "";
            Meteor.call('pushKeys', api_key, api_secret);
            
        },
        "submit #desired-allocation":function(event){
            event.preventDefault();
            //var n=allocations.length;
            //var totalValue=0;
            /*for(var i=0; i<n; i++){
                allocations[i].value=event.target[i].value;
                totalValue+=allocations[i].value;
            }*/
            if(totalValue===100){
                Meteor.call('allocation', allocations);
            }            
        },
        'change .allocation':function(event){
            //console.log(event.target.id);
            //storeValues[event.target.id]=event.target.value;
            //var n=allocations.length;
           // var totalValue=0;
            var flt=parseFloat(event.target.value);
            var $parent=$(event.target.parentElement);
            if(!flt){
                $parent.addClass('has-error');     
                return;
            }
            if(flt<0||flt>100){
                $parent.addClass('has-error');          
                return;
            }
            $parent.removeClass('has-error');      
            var n=allocations.length;
            var totalVal=0;
            //console.log(allocations);
            for(var i=0; i<n; i++){
                if(allocations[i].name===event.target.id){
                    allocations[i].value=flt;
                }
                if(allocations[i].value){
                    totalVal+=allocations[i].value;
                }
                
            }
            console.log(allocations);
            Session.set('totalValue', totalVal);
            //Session.set('allocation', allocations);
        }
    });
    Template.settings.helpers({
        hasKeys:function(){
            return Keys.find({}).count()>0;
        },
        currentAllocation:function(){
            var dt=Allocations.find({}).fetch();//||allocations);
            if(dt[0]){
                return dt;
            }
            else{
                return allocations;
            }
            //return Allocations.find({}).fetch()allocations;
        },
        hasOneHundred:function(){
            /*var vals=Session.get('allocation');
            var totalVal=0;
            for(keys in vals){
                if(vals[keys].value){
                    totalVal+=vals[keys].value;
                }
            }*/
            return Session.get('totalValue')===100;
            /*var val=0;
            $('.allocation').each(function(elem, value){
                console.log(this.id);
                if(Session.get(this.id)){
                    var vl=parseFloat(value);
                    if(vl){
                        val+=vl;
                    }
                    else {
                        return false;//"All values must be numbers";
                    }
                }
            });
            console.log(val);
            if(val!==100){
                return false;//"Values must add to 100";
            }
            else{
                return true;
            }*/
        }
        
    });
}    
    