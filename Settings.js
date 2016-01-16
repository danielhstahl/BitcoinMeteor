if(Meteor.isClient){
    Template.settings.events({
        "submit #add-api-keys": function (event) {
      // Prevent default browser form submit
            event.preventDefault();
            var api_key = event.target[0].value;
            var api_secret = event.target[1].value;

          // Insert a task into the collection
            /*Keys.insert({
                api_key: api_key,
                api_secret:api_secret,
                owner: Meteor.userId(),
                username: Meteor.user().username,
                createdAt: new Date() // current time
            });*/
            event.target[0].value = "";
            event.target[1].value = "";
            Meteor.call('pushKeys', api_key, api_secret);
            
        }
    });
    Template.settings.helpers({
        hasKeys:function(){
            return Keys.find({}).count()>0;
        }
    })
}    
    