/**
 * New node file
 */

  var exports = module.exports = {};
  var mongoose = require('mongoose');
  var db = mongoose.connect('mongodb://localhost/myroomweb');
  exports.db=mongoose.connection;
  var _roomSchema=require('../model/room');
  exports.rooms=_roomSchema;
  //   var x=5;

 //Function to Export Create Schema::Deepak Tiwari

   
 
 
 
     
  //Function to Export store Room::Deepak Tiwari 
  exports.storeRoom=function(room){
	      var err1=0;
	      room.save(function(err) {
		     if (err){ throw err;}
		  });
	    
 };


exports.findAllRooms=function(req,res){
	
	       
	    _roomSchema.find(function(err,rooms){
		   if(err){res.send("error connecting to databse");}
		   else{res.send(rooms);}
	 });
};



   
		           
		  
    
    /**DO YOU KNOW??? 
         function which we like to expose to other modules
    	 should be exposed via exports or module.exports..
    */
    
 exports.checkThisRoom=function(req,res){
			
		   
 	_roomSchema.find({room_name :req.body.rooms.roomname}).where('room_key').equals(req.body.rooms.roomkey).exec(function(err,room){
	         
	      if(err){res.send("error");}
	         if(room.length<0){res.send("roommodel:room not found");}
	         else{    
	         		    req.login(room,function(err){
	         		    if(err){res.render('500');}
	         		    else{
	         			        console.log("roommodel:room found::"+ room);
	         					req.flash('success','found');		
	         					res.redirect('/');}
	         		 });
	         		 }
	         });
};
