var express = require('express');
var app = express();
var router = express.Router();
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/plants';
var everythingData;
var mongodb = require('mongodb');
var request = require('request');

router.all('/', function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log("Yeah here first");
  next();
 });
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Plant What!?!?' });
});
router.get('/signup', function(req, res) {
  res.render('index', {title: 'Plant What!?!?'});
});

router.post('/signup', function(req,res){
  console.log(req.body);
  enteredzip = req.body.zipcode;
  ziplength = enteredzip.toString().length;
  if(ziplength < 5 || ziplength > 5) {
        console.log("match");
        return res.render('index', {title: "Lets Plant!", message:"Enter valid US zip."});
        
  }
  zipcodeLogic(enteredzip, res, function(callback) {
  	  console.log("callback: " + callback);
  	  	returnList = callback;
  	  	var city = getCity();
        var fallfrost = getFrostFL();
        var springfrost = getFrostSP();
		res.render('signup', {enteredzip: enteredzip, success: returnList, cityname: city, frostSP: springfrost, frostFL: fallfrost});
  });









});





router.get('/bootstrap', function(req, res) {
  res.render('bootstrap', {});
});
//FIND PLANTS IN RANGE 





//MAIN NEWPLANT LANDING
router.get('/newplant', function(req,res){ 
  MongoClient.connect(url, function(err, db) {
    console.log("connected correctly");
    printDB(db, function(callback) {
    	if(callback)console.log("PrintDB:DB:callback.length: " + callback.length);
    	res.render('newplant', {success: callback});
    	db.close();
    });

 

  });
   var printDB = function(db, callback) {
    	console.log("printDB reached");
   		var collection = db.collection('plants');
	    collection.find().toArray(function(err, documents) {
	    	callback(documents);
	    });
	}
});
//ADD PLANT
router.post('/newplant', function(req,res){
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null,err);
	    console.log("connected correctly: req: " + JSON.stringify(req.body) + " res: " + res.body);
	    if(req.body.dbid != "") { 

        updateDB(db, function(callback) {
          console.log('updating: ' + JSON.stringify(callback));

          printDB(db, function(callback) {
            res.render('newplant', {success: callback});
            db.close();
          });
        });
      }else{
        insertDB(db, function(callback) {
        console.log("Success: " + JSON.stringify(callback));
        printDB(db, function(callback) {
          if(callback)console.log("PrintDB:DB:callback.length: " + callback.length);
          res.render('newplant', {success: callback});
          db.close();
        });

        });
      }

	    
	});
  var updateDB = function(db, callback) {
    console.log("updateDB reached");
    var collection = db.collection('plants');
    var newObjID = new mongodb.ObjectID(req.body.dbid);
    var matchstring = {_id:newObjID};
    console.log("matchstring: " + JSON.stringify(matchstring));
    collection.update(matchstring, {$set:{"Common Name":req.body.commonname,"Frost Differential MIN":req.body.frostdifferentialMIN,"Frost Differential MAX":req.body.frostdifferentialMAX,"Indoor Start MIN":req.body.indoorstartdaysMIN,"Indoor Start MAX":req.body.indoorstartdaysMAX, "Description":req.body.description, "Image Link":req.body.imageLink, "Wikipedia Link":req.body.wikiLink, "Purchase Link":req.body.purchaseLink}}, function(err,result) {
      callback(result);
    });
  }
	var insertDB = function(db, callback) {
		console.log("insertDB reached");
		var collection = db.collection('plants');
		console.log("post: " + req.body);
		collection.insert({"Common Name":req.body.commonname,"Frost Differential MIN":req.body.frostdifferentialMIN,"Frost Differential MAX":req.body.frostdifferentialMAX,"Indoor Start MIN":req.body.indoorstartdaysMIN,"Indoor Start MAX":req.body.indoorstartdaysMAX, "Description":req.body.description, "Image Link":req.body.imageLink, "Wikipedia Link":req.body.wikiLink, "Purchase Link":req.body.purchaseLink}, function(err,result) {
			callback(result);
		});
		
		
	}
	var printDB = function(db, callback) {
    	console.log("printDB reached");	
   		var collection = db.collection('plants');
	    collection.find().toArray(function(err, documents) {
	    	callback(documents);
	    });
	}
});

router.get('/editplant', function(req,res) {
  console.log("editplant reached");
  var id = req.query.id;
  MongoClient.connect(url, function(err, db) {
    //assert(null,err);
   console.log("connected correctly: req: " + req.url + " res: " + res + " req.param: " + req.query.id);
    getPlant(db, id, function(callback) {
      console.log("Callback: " + JSON.stringify(callback));
      res.send(JSON.stringify(callback));
      db.close();
    });
  });
function getPlant(db, id, callback) {
  console.log('getting plant');
  var collection = db.collection('plants');
  var newObjID = new mongodb.ObjectID(id);
  var findstring = {_id:newObjID};
  collection.find(findstring).toArray(function(err, documents) {
    callback(documents);
  });
}
});
router.get('/removeplant', function(req, res) {
	console.log("remove plant reached");
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null,err);
	    console.log("connected correctly: req: " + req.url + " res: " + res + " req.param: " + req.query.id);
	    var id = req.query.id;
		deleteDB(db, id, function(callback) {
			res.send(JSON.stringify(callback));
			db.close();
			});


	    });

	var deleteDB = function(db, id, callback) {
	    	console.log("deleteDB reached id: " + id);
	    	var collection = db.collection('plants');
	    	var newObjID = new mongodb.ObjectID(id);
	    	var removestring = {_id:newObjID};
			console.log("removeString: " + JSON.stringify(removestring));
	    	collection.remove(removestring, function(err, r) {
	    		console.log("removeOne err: " + err + " response: " + r);
	    		callback(r);
	    		
	    	});

	    }

});
	  //-   cursor.count(function(err,count) {
	  //-   	console.log("Count: " + count);
	  //-   	var records = count;
	  //-   	console.log("Records: " + records);	   
			//- console.log("Records before while: " + records);
			//- console.log("Type OF: " + typeof(count) + " records: " + typeof(records));
			//- console.log("recordsBeforeLoop: " + records);   
			//-     while(records >= 0) {
			//- 		console.log("recordsAfterWhile: " + records);
			//- 		cursor.nextObject(function(err,item) {
			//- 		      	//- test.equal(null, err);
			//- 		      	//- test.equal(1, item.a);
			//- 		      	records--;
			//- 		      	console.log("item: " + item);
			//- 			      	if(err) {
			//- 			      		console.log("hasNext is null");
						        	
			//- 			        }
			//- 		      		console.log("item: " + item['Common Name']);
			//- 		      		outputArrayAdd(item['Common Name']);
			//- 		      		console.log("output length: " + outputArray.length);
			//- 		      		console.log("records: " + records);
			//- 		      		if(records == 1) {
			//- 						console.log("output length end: " + outputArray.length);
									
			//- 						records--;
			//- 						callback(outputArray);
			//- 					}
								
								
			//- 		    });
					
					
			//- 	}
	
		
   //-   });
//SIGNUP LOGIC
var cityName;
function getCity() {
	return cityName;
}
var frostSP, frostFL;
function setFrosts(sp,fl) {
  frostSP = sp;
  frostFL = fl;
}
function getFrostSP() {
  var shortDate = frostSP.toDateString().substr(3,7);
  return shortDate;
}
function getFrostFL() {
  var shortDate = frostFL.toDateString().substr(3,7);
  return shortDate;
}
function zipcodeLogic(zipcode, res, callback) {


   var enteredzipcode = zipcode;
    var responseText;
    var todaysDate = new Date();

    function makeDate(date) {
            console.log("setting date: " + date + " substrings: " + date.substr(0,2) + " setting month: " + date.substr(2,3));
            var realDate = new Date();
            realDate.setHours(0,0,0,0);
         
              realDate.setMonth(date.substr(0,2)-1);  // subtract 1 for 0 index
              realDate.setDate(date.substr(2,3));
              console.log("actual: " + realDate);
          
            return realDate;

    }
    function plantchecker(springfrostd, fallfrostd) {
         
         var spring = makeDate(springfrostd);
         var fall = makeDate(fallfrostd);
         //$('.fallfrostdate').html("Fall Frost: " + fall);
         //$('.springfrostdate').html("Spring Frost: " + spring);
         console.log("Spring " + spring + " Fall " + fall);
         weeksfromfrosts(spring, fall);
         //, function(callback) {
         	//callback(callback);
         //});

    }
    function weeksfromfrosts(sp, fl){
        setFrosts(sp,fl);
        var daysToSpring;
        var daysToFall;
        var daysFromFall;
        var daysFromSpring;
        var now = new Date();
        now.setHours(0,0,0,0);

        var diff1 = ( sp - now )/ (1000*60*60*24); //time to spring
        var diff2 = ( fl - now )/ (1000*60*60*24); //time to fall
        console.log("diff1: " + diff1 + " diff2: " + diff2);
        if(diff1 < 0 && diff2 < 0) {
          daysFromSpring = diff1;
          daysFromFall = diff2;
          console.log("both dates next year"); 
          sp.setFullYear(sp.getFullYear()+1); 
          fl.setFullYear(fl.getFullYear()+1);
           diff1 = ( sp - now )/ (1000*60*60*24); //time to spring
           diff2 = ( fl - now )/ (1000*60*60*24); //time to fall
           console.log("diff1: " + diff1 + " diff2: " + diff2);
           daysToSpring = diff1;
           daysToFall = diff2;

        }else {
        if(Math.abs(diff1) > Math.abs(diff2)) { //closer to fall
          if(diff1 < 0) { //after spring frost
            console.log("SP.getFullYear1: " + sp.getFullYear());
            var currentYear = sp.getFullYear() +1;
            sp.setFullYear(currentYear);
            console.log("SP.getFullYear2: " + currentYear + " setting " + sp.getFullYear());
            daysToFall = diff2;
            daysFromSpring = diff1;
            daysToSpring = (sp - now)/ (1000*60*60*24);
            fl.setFullYear(fl.getFullYear()-1);
            daysFromFall = (fl - now)/(1000*60*60*24);

            console.log("closer to fall, after spring frost, daysToFall: " + daysToFall + " daysToSpring: " + daysToSpring + " daysFromFall: " + daysFromFall + " daysFromSpring: " + daysFromSpring);
            
          } else if(diff2 < 0) { //after fall frost
	            daysFromFall = diff2;
	            daysToSpring = diff1;

	            fl.setFullYear(fl.getFullYear()+1);
	            daysToFall = (fl - now)/(1000*60*60*24);
	            sp.setFullYear(sp.getFullYear()-1);
	            daysFromSpring = (sp - now)/(1000*60*60*24);

	            console.log("closer to fall, after fall frost, daysToFall: " + daysToFall + " daysToSpring: " + daysToSpring + " daysFromFall: " + daysFromFall + " daysFromSpring: " + daysFromSpring);
	            

	            }
	       else if(diff1 > 0 && diff2 > 0) {  //after both
	            daysToFall = diff2;
	            daysToSpring = diff1;
	            sp.setFullYear(sp.getFullYear()-1);
	            fl.setFullYear(fl.getFullYear()-1);
	            daysFromFall = (fl - now)/(1000*60*60*24);
	            daysFromSpring = (sp - now)/(1000*60*60*24);

	            console.log("closer to fall, before fall frost, daysToFall: " + daysToFall + " daysToSpring: " + daysToSpring + " daysFromFall: " + daysFromFall + " daysFromSpring: " + daysFromSpring);
	            
	          }
          }else{ //closer to spring
           if(diff2 < 0) { //after fall frost
              daysFromFall = diff2;
              fl.setFullYear(fl.getFullYear()+1);
              daysToFall = (fl - now)/(1000*60*60*24);
              daysToSpring = diff1;
              sp.setFullYear(sp.getFullYear()-1);
              daysFromSpring = (sp - now)/(1000*60*60*24);
              console.log("closer to spring, after fall frost, daysToFall: " + daysToFall + " daysToSpring: " + daysToSpring + " daysFromFall: " + daysFromFall + " daysFromSpring: " + daysFromSpring);
           }
           if(diff1 < 0) { //after spring frost
              var currentYear = sp.getFullYear();
              sp.setFullYear(currentYear+1);
              daysToFall = diff2;
              daysFromSpring = diff1;
              daysToSpring = (sp - now)/ (1000*60*60*24);
              fl.setFullYear(fl.getFullYear()-1);
              daysFromFall = (fl - now)/(1000*60*60*24);

              console.log("closer to spring, after spring frost, daysToFall: " + daysToFall + " daysToSpring: " + daysToSpring + " daysFromFall: " + daysFromFall + " daysFromSpring: " + daysFromSpring);
            
          }


		
        }
    }

		printPlants(daysToFall, daysToSpring, daysFromFall, daysFromSpring);
		//, function(callback) {
		//	console.log('callback: pp:  ' + callback);
        //	callback(callback);
       // });

		
       
        
    }

    function printPlants(daysToFall, daysToSpring, daysFromFall, daysFromSpring) {
    	var returnvalue;
    	var cityName;
    	MongoClient.connect(url, function(err, db) {
    		
    		console.log("printplants: ");
    		var collection = db.collection('plants');
    			console.log("collection: " + collection);
    			var weeksToFall = Math.round((daysToFall/7)*(-1)).toString();  //invert to make relative to frost date to match db
    			var weeksToSpring = Math.round((daysToSpring/7)*(-1)).toString();
    			var weeksFromFall = Math.round((daysFromFall/7)*(-1)).toString();
    			var weeksFromSpring = Math.round((daysFromSpring/7)*(-1)).toString();
    			console.log("Weeks to Fall: " + weeksToFall + "  Weeks to Spring: " + weeksToSpring + " Weeks from Fall: " + weeksFromFall + " Weeks from Spring: " + weeksFromSpring);
    			//weeksFromFall = '-4';
    			collection.find({$or : [
    				{"Frost Differential MIN" :weeksToFall},
    				{"Frost Differential MIN" :weeksToSpring},
    				{"Frost Differential MIN" :weeksFromFall},
    				{"Frost Differential MIN" :weeksFromSpring},
    				{"Frost Differential MAX" :weeksToFall},
    				{"Frost Differential MAX" :weeksToSpring},
    				{"Frost Differential MAX" :weeksFromFall},
    				{"Frost Differential MAX" :weeksFromSpring}
    				] }).toArray(function(err, documents) {
    				db.close();
	    			console.log("FINDRESULT: " + documents + "Error: " + err);
    			
	    			callback(documents);
	    		});

    		
    		
	    	
    		});
    	
		
    	}
   //    function checkDB(db) {
   //  			var collection = db.collection('plants');
   //  			console.log("collection: " + collection);
   //  			collection.find({}).toArray(function(err, documents) {
   //  				db.close();
	  //   			console.log("FINDRESULT: " + documents);
    			
	  //   			callback(documents);
	  //   		});
				
	  // }
    
    function setName(name) {
    	cityName = name;
    }
    
    var requestURL1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + zipcode + '&key=AIzaSyChhEVkT42eJw3Zwui9SMtG7R3sbJf6KEs';

    var basic = 'http://www.google.com';
    var s1 = request(requestURL1, function(error, response) {

    	console.log("s1 running");
    	console.log("response: " + response.body + "  error: " + error + " zipcode: " + enteredzipcode + " reqURL: " + basic);

      if(JSON.parse(response.body).status == "ZERO_RESULTS") {
        console.log("match");
        return res.render('index', {title: "Lets Plant!", message:"Enter valid zip."});
        
      }
    	var results = JSON.parse(response.body);
    	//results = JSON.parse(results);
    	console.log("results s1: " + JSON.stringify(results.results));
   		results = results.results;
   		var lat = results[0].geometry.location.lat;
   		var lng = results[0].geometry.location.lng;
   		console.log("lat: " + lat + " long: " + lng);
    	if(!error) {
    		console.log("s1: " + response);
    		//response = JSON.stringify(response);
      		 //$(".latlong").html("Latitude: " + lat + " Longitude: " + lng);
          var cname = results[0].address_components[1].long_name + ", " + results[0].address_components[3].long_name;
          setName(cname);
       		var frostURL = "http://farmsense-prod.apigee.net/v1/frostdates/stations/?lat=" + lat + "&lon=" + lng;
       		var s2 = request(frostURL, function(error, response) {
       			if(!error) {

       				var results = JSON.parse(response.body);

       				console.log("s2: " + JSON.stringify(results));
       			
       				var stationID = results[0].id;
       			
         			//alert(JSON.stringify(results));
         				var fallfrost = "http://farmsense-prod.apigee.net/v1/frostdates/probabilities/?station=" + stationID + "&season=2";
          				var springfrost = "http://farmsense-prod.apigee.net/v1/frostdates/probabilities/?station=" + stationID + "&season=1";
         				var falldate;
          				var springdate;

          				request(fallfrost, function(error, response) {
          					if(!error) {
          						var results = JSON.parse(response.body);

       							console.log("s3: " + JSON.stringify(results));
          						falldate = results[1].prob_50;
          						request(springfrost, function(error, response) {
          							if(!error) {
          								var results = JSON.parse(response.body);
          								console.log("s4: " + JSON.stringify(results));
          								springdate = results[1].prob_50;
          								console.log("calling plantchecker(" + springdate + "," + falldate);
            							if(springdate == '0000') springdate = '0207';  //no frost cases
            							if(falldate == '0000') falldate = '1217';
            							plantchecker(springdate,falldate, function(callback) {
            								console.log("Logchecker: " + callback);
            								callback(callback);
            							});
          							}
          						});
          					}
          				});
          				
       			}
       		})
    	}
    });

    // var jqxhr = $.ajax( {url: requestURL, datatype: "json"} )
    //   .done(function() {
    //    //alert( "success" );
    //    responseText = jQuery.parseJSON(jqxhr.responseText);
    //     console.log("response1: " + responseText);
    //   })
    //   .fail(function() {
    //    alert( "error" );
    //   })
    //   .always(function() {
    //    var results = responseText.results;
    //    var lat = results[0].geometry.location.lat;
    //    var lng = results[0].geometry.location.lng;
    //    //$(".latlong").html("Latitude: " + lat + " Longitude: " + lng);
    //    var frostURL = "http://farmsense-prod.apigee.net/v1/frostdates/stations/?lat=" + lat + "&lon=" + lng;
    //    var jqxhr2 = $.ajax( {url: frostURL, datatype: "json"} )
    //      .done(function() {
    //        responseText = jQuery.parseJSON(jqxhr2.responseText);
    //        console.log("response2: " + responseText);
    //        })
    //      .fail(function() {
    //      	//alert("error");
    //        })
    //      .always(function() {
    //      	var stationID = responseText[0].id;
    //      	//alert(JSON.stringify(results));
    //      	var fallfrost = "http://farmsense-prod.apigee.net/v1/frostdates/probabilities/?station=" + stationID + "&season=2";
    //       var springfrost = "http://farmsense-prod.apigee.net/v1/frostdates/probabilities/?station=" + stationID + "&season=1";
    //      	var falldate;
    //       var springdate;
    //       var jqxhr3 = $.ajax( {url: fallfrost, datatype: "json"})
    //        .done(function() {
    //        responseText = jQuery.parseJSON(jqxhr3.responseText);
    //        console.log("response3" + responseText);
    //        })
    //        .fail(function() {
    //          //alert("error");
    //        })
    //        .always(function() {
    //         falldate = responseText[1].prob_50;
    //         //alert(JSON.stringify(responseText));
    //         //$(".fallfrostdate").html("fall: " + falldate);

    //         var jqxhr4 = $.ajax( {url: springfrost, datatype: "json"})
    //        .done(function() {
    //         responseText = jQuery.parseJSON(jqxhr4.responseText);
    //         console.log("response4 " + responseText);
    //         springdate = responseText[1].prob_50;
    //         //alert(JSON.stringify(responseText));
    //         //$(".springfrostdate").html("spring: " + springdate);
            
    //        })
    //        .fail(function() {
    //          //alert("error" + jqxhr4.responseText);
    //        })
    //        .always(function() {
    //         console.log("calling plantchecker(" + springdate + "," + falldate);
    //         if(springdate == '0000') springdate = '0215';
    //         if(falldate == '0000') falldate = '1215';
    //         plantchecker(springdate,falldate);
    //        });
    //        });




    //      	});

    //     });

    }



module.exports = router;
