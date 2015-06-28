/**
 * New node file
 */

  var mongoose = require('mongoose');

//Function to Export Create Schema::Deepak Tiwari

    
var room=new mongoose.Schema({
		
	     room_admin_email : { type: String, required: true, index: { unique: true } },
	     room_admin_mobile: { type: Number, required: true, index: { unique: true }},
	     room_room_type: String,
	     room_name:   { type: String, required: true, index: { unique: true } },
	     room_key :     { type: String, required: true},
	     room_creationdate: { type: Date,Default:Date.now},
	     room_isPermanent : Boolean,
	     room_members:[
		   {
			 member_name:String,
			 member_email:String,
		 	 member_mobile:Number
		 }
	    ]
      });
 
  
console.log("room1 created or schema created");
    

//function End
module.exports=mongoose.model('Myroom',room);

