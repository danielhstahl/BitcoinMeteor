if(Meteor.isClient){
    /*Template.portfolio.rendered = function() {
        getValues();
        //piePortfolio();
    },*/
    var animate=true;
    Template.portfolio.helpers({
        hasKeys:function(){
            //console.log(Keys.find({}).count());
            return Keys.find({}).count()>0;
        }//,
    });
    
    
    Template.portfolio.onRendered(function () {
		//var cursor = Template.currentData(),
        var numeraire;
        if(!numeraire){
            numeraire='USD';
        }
        var query=Wallets.find({});
        var data=getValues(query, numeraire);
        var initializing = true; // add initializing variable, see:  http://docs.meteor.com/#/full/meteor_publish
        var liveChart;
	   
		// Create basic line-chart:
		if(data){
            liveChart = Highcharts.chart('chart', {
                title: {
                    text:'Total Value: '+data.totalValue
                },
                series: [{
                    type: 'pie',
                    data: data.values
                }]
            });
        }
		// Add watchers:
		query.observe({
            added: function (dtNew, dtOld) {
                //console.log(dtNew, dtOld);
                //var data=getValues(query);
                //console.log(data);
                data=getValuesSpecific(dtNew, numeraire);
                //console.log(data);
                if (!initializing&&liveChart) {
                    liveChart.series[0].setData(data.values);
                    liveChart.setTitle({text:'Total Value: '+data.totalValue});
                }
                else{
                    liveChart = Highcharts.chart('chart', {
                        title: {
                                text:'Total Value: '+data.totalValue
                        },
                        series: [{
                            type: 'pie',
                            data: data.values
                        }]
                    });
                }
            }
		});   
		initializing = false;
	});
    function getValuesSpecific(data, numeraire){
        var n=data.values.length;
        var bln=0;
        for(var i=0; i<n; i++){
            data.values[i].y=data.values[i][numeraire+'Balance'];
            bln+=data.values[i].y;
            data.values[i].name=data.values[i].currency;
        }
        data.totalValue=bln;;
        return data;
    }    
    function getValues(cursor, numeraire){
        
        var walletData=cursor.fetch();//Wallets.find({}).fetch();
        //console.log(walletData);
        if(walletData[1]){
            return getValuesSpecific(walletData[1], numeraire);
            //piePortfolio(walletData);
        }
    }
}