if(Meteor.isClient){
    Meteor.subscribe("links");
    Template.sidebar.helpers({
        link: function () {
            return Links.find({});
        },
        activeListClass(link) {
            //console.log(link);
            //console.log(ActiveRoute.name('links.list'));
            const active = ActiveRoute.name('links.list') && FlowRouter.getParam('_id') === link.elid;
            return active && 'active';
        }
    });
    /*Template.sidebar.events({
        "click a": function (event) {
            Links.update({_id:Links.findOne({select:true})['_id']}, {
                $set: {select: false}
            });
            Links.update(this._id, {$set: {select:true}});
        }
    });*/

    FlowRouter.route('/:_id', {
        name: 'links.list',
        action(params, queryParams) {
            BlazeLayout.render('App_body', {main: params._id}); //THIS MAY BE BAD DESGIN!!!  this id needs to correspond to the NAME of the template
        }
    });
    
}
