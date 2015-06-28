/**
 * 
 */
// This File Contains all Route Handling related Stuff:: Deepak Tiwari
 var app=require('../app');
 var express = require('express');
 var flash = require('connect-flash');
 var router=module.exports =express.Router();
 var bodyParser=require('body-parser');
 var  passport = require('passport');
 var LocalStrategy = require('passport-local');
 var bCrypt = require('bcrypt-nodejs'); 
  var mongoose = require('mongoose');
  
 
//express().use(bodyParser.urlencoded());
express().use(bodyParser.json());


router.use(flash()); 


 
var myroom=require('../model/roommodel');
var _roomSchema=require('../model/room');
 
var db = myroom.db;

db.on('error',function(msg){
		console.log(msg);
});
db.once('open',function(msg){
		console.log('connection succeeded');
});









passport.use( new LocalStrategy(verifyCredentials));
//passport_http.use( new LocalStrategy.Strategy(verifyCredentials)); 




function verifyCredentials(username,password, done) { 
    // check in mongo if a user with username exists or not
   process.nextTick(function() { 
	   _roomSchema.findOne({ 'room_name' :  username,'room_key' : password }, function(err, room) {
      // In case of any error, return using the done metod
      if (err){  done(err);}
       
      // Username does not exist, log error & redirect back
       if (!room){  done(null, false); }
       
       else {  done(null,room);}
      // User exists but wrong password, log the error 
      
      // User and password both match, return user from 
      // done method which will be treated like success
      
    });});
}




passport.serializeUser(function(room,done){
   done(null,room);

});
passport.deserializeUser(function(room,done){
 
   done(null,room);
});






 router.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!');
  next();
  res.redirect('/');
});




 
 // #1
  router.get('/', function(req,res){
      console.log(req.room);
      //req.flash('success', 'This is a flash message using the express-flash module.');
      //res.redirect(301, '/');      
	// res.render('index',{title:'myroom',footer:'My Footer',message: req.flash('info') });
	 res.render('default',{title:'myroom',expressFlash: req.flash('info')});
 });


// #2
  router.get('/getallrooms',function(req,res){
      	    console.log('called');
		    myroom.findAllRooms(req,res);
	});

  
  
  // #3
  router.post('/storeroom',function(req,res){
	    //debugger;
	   // myroom.checkThisRoom(req,res);
	   //req.flash('info', 'user already there Dude !!');
	  myroom.rooms.find({room_name:req.body.room.name}, function(err,rooms){
		      		if(err){res.send("error");}
		      	    if(rooms.length>0) {
		      	  		 		 		 req.flash('info', 'Room already there..Change Room name !!');
		      	  		  				 res.redirect('/');
		      	  		  				  	   
		      	                    }  
		      	  
		  else{
		      	     
		      	    var room=new _roomSchema({ room_admin_email:req.body.room.email,
					 room_admin_mobile:req.body.room.mobile,
                     room_room_type: 'TEMP',
                     room_name: req.body.room.name,
                     room_key :  req.body.room.key,
                     room_creationdate: Date.now() ,
                     room_isPermanent :false,
                     room_members:[
	                {
		                  
	                }
                  ]   
		      });
	   				//store Room
	   		try{		
	            var m=myroom.storeRoom(room);}
	          catch(err){
	               res.send("sorry DB Error");
	            }
	         
		      	//  res.send("ERROR WHILE SAVING");
		      	//else
	            res.redirect('/success');
		      	  
		      	//res.send("Room Created Successfully !!");  			
		      }				
		    });
		});  
		    




//#4
 router.post('/login', passport.authenticate('local', 
    {session: true, 
    successRedirect: '/getroom',
    failureRedirect: '/roomnotfound',
    failureFlash : true 
  }));
 			//console.log("middleware calling finished");
 			//console.log(req.room);
 			//res.send("found");
 			//console.log(req.body.rooms.roomname);
 			//console.log(req.body.rooms.roomkey);
 			//req.flash('info','checking');
 			
 			//myroom.checkThisRoom(req,res);
 			
 	  			
			
 			//});


//#5
 router.get('/roomalreadyexist',function(req,res){
 			//res.send('not found');
 	  res.render('room_alreadyexist',{title:'room already there'});
 	
 	});


//#6
router.get('/getroom',function(req,res){
            //res.send('room');
        //res.render('room',{title:'welcome ',room:req.user } );
	
        res.render('room_main',{title:'welcome ',len:req.user.room_members.length,room:req.user,expressFlash: req.flash('info') } );
           //room: req.room 
          
    
    });



//#7
 router.get('/logout',function(req,res){
            req.logout();
            req.flash('info','successfully logged out');	
            res.redirect('/');
        //  res.render('rooms',{title:'roomalreadythere'});
    
    });


//#8
router.post('/:id/edit', function(req,res){
	
	 _roomSchema.findOne({ '_id' :  req.params.id },function(err, room){
	
		 room.room_name=req.body.room.name;
		 room.room_key = req.body.room.key;
		 room.room_admin_email = req.body.room.email;
		 room.room_admin_mobile = req.body.room.mobile;
		 
		 room.save(function(err){
			 
			 if(err){throw err;}
		 });
		 
		 console.log("successfully updated");
		 res.redirect('/getroom');
	 });
	
});
	

//#9
router.post('/:id/addmember',function(req,res){
	
	 _roomSchema.findOne({ '_id' :  req.params.id },function(err, room){
	
		room.room_members.push(
				{
	               member_name: req.body.member.name,
		           member_email: req.body.member.email,
		           member_mobile: req.body.member.mobile
		   });
		 
		room.save(function(err){
			 
			 if(err){throw err;}
		 });
		 
		 console.log("member updated");
		 req.flash('info','Member Added !! Kindly Relogin !!');
		 res.redirect('/getroom');
	 });
	
});


 //#10
 router.get('/:id/delete',function(req,res){
	
	 _roomSchema.findOne({ '_id' :  req.params.id },function(err, room){
		 
		 if(err){throw err;}
		 room.room_members.
		 room.remove(function(err){
			 if(err){throw err;}
	     });
	     res.send('successfully deleted');
	
	 });
});


 router.get('/:id/deletemember',function(req,res){
		
	console.log(req.user.room_members);
	 //var room=req.user;
	//var roommembers=req.user.room_members;
	
	
	
		 _roomSchema.update(
				  { _id: req.user._id },
				  { $pull: { 'req.user.room_members': { '_id ': req.params.id } } }
				);
		 	req.flash('info','member successfully deleted !!');
	        res.redirect('/getroom');
	
});


//#11
router.get('/success',function(req,res){
	res.render('roomcreate_success',{title:"Room SuccessFully created"});
});


//#12
router.get('/roomnotfound',function(req,res){
	req.flash('info','Room Not Found');
	res.redirect('/');
	//res.render('roomnotfound',{title:"Room Not Found"});
});

//#13
router.get('/room',function(req,res){
	res.render('roomnotfound',{title:"Room Not Found"});
});
