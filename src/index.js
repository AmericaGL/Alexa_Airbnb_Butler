// CONFIGURATION
// Role : Lambda_basic_execution
// Runtime: Node.js 4.3
// Handler index.handler
// make sure connected to U.S (N. Virginia)


// EVENT SOURCE
// Alexa Skills Kit

// CODE

// Brown Bear Alexa sample skill
// see https://amzn.com/0805047905

// var AWS = require('aws-sdk');

exports.handler = function( event, context ) {
    var say = "";
    var endsession = false;
    var sessionAttributes = {};
    var myColor = "brown";
    var myAnimal = "bear";

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }

    if (event.request.type === "LaunchRequest") {
        say = "Welcome! Airbnb guest, would you like to know the house rules? Say what are the house rules?" 
        //say = "Welcome! L A Brown bear, brown bear, what do you see?";

    } else {
        var IntentName = event.request.intent.name;

        if (IntentName === "HouseRulesIntent") {

           say = "Please keep your room clean.  " +
	       "Cleaning tools located under kitchen sink.  " +
	       "Laundry days are Friday, Saturday and Sunday, 8am to 8pm.  " +
	       "No smoking. " +
	       "Turn off lights.  " +
	       "If bringing overnight guest, please pay for their stay.  " +
	       "Last Day of Stay, please take your food with you or give to your roommates.  " +
	       "Would you like to know what is the wifi? Say what is the wifi?";
	    
        }   
	     
	  else if (IntentName === "WifiIntent") {
            say = "Here is the wifi, Network is, angel, hack, password is, you, are, awesome ";
            
	  }        
      
      else if (IntentName === "InChargeIntent"){
          say = "America, Penelope, and Their parents, Richard and Jasmine";
          
      }
      
      else if (IntentName === "ParkingInsideIntent")
      {
          say = "You have to park outside.";
          
      }
      
      else if (IntentName === "TrashIntent")
      {
          say = "you and other airbnb guests takes out the trash";
      }
      
      else if (IntentName === "ContactHostIntent")
      {
          say = "host name is America, her contact info is, 323, 340, 3500";
      }
      
      else if (IntentName === "HostDoIntent")
      {
          say = "Our hosts, The CyberCode Twins likes to be involve in community and kicks butt at hackathons. That's how I was created to greet awesome airbnb guests like you.";
	 
      }
        
        else if (IntentName === "EndIntent") {
            say = "Enjoy your stay "; 
            endsession = true;

        }
    }

    var response = {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + say + "</speak>"
        },
        reprompt: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>Please try again. " + say + "</speak>"
            }
        },
        card: {
            type: "Simple",
            title: "My Card Title",
            content: "My Card Content, displayed on the Alexa Companion mobile App or alexa.amazon.com"
        },

        shouldEndSession: endsession
    };



    Respond(  // Respond with normal speech only
        function() {context.succeed( {sessionAttributes: sessionAttributes, response: response } ); }
    );


    // --------- Uncomment for AWS SQS Integration -------------------------------------------------
    //RespondSendSqsMessage(  // use this to send a new message to an SQS Queue
    //    {
    //        MessageBody:  "https://www.google.com/search?tbm=isch&q=" + myColor + "%20" + myAnimal  // Message Body (Image Search URL)
    //    },
    //     function() {context.succeed( {sessionAttributes: sessionAttributes, response: response } ); }
    //);


    // --------- Uncomment for AWS IOT Integration -------------------------------------------------
    //RespondUpdateIotShadow(  // use this to update an IoT device state
    //    {
    //        IOT_THING_NAME: "MyDevice",
    //        IOT_DESIRED_STATE: {"pump":1}  // or send spoken slot value detected
    //    },
    //    function() {context.succeed( {sessionAttributes: sessionAttributes, response: response } ); }
    //);


};

// -----------------------------------------------------------------------------

function Respond(callback) {
    callback();
}

function RespondSendSqsMessage(sqs_params, callback) {

    sqs_params.QueueUrl = "https://sqs.us-east-1.amazonaws.com/333304289684/AlexaQueue";

    var sqs = new AWS.SQS({region : 'us-east-1'});


    sqs.sendMessage(sqs_params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log("success calling sqs sendMessage");

            callback();  // after performing SQS send, execute the caller's context.succeed function to complete
        }
    });

}


function RespondUpdateIotShadow(iot_config, callback) {

    iot_config.IOT_BROKER_ENDPOINT      = "https://A2ESHRCP6U0Y0C.iot.us-east-1.amazonaws.com".toLowerCase();
    iot_config.IOT_BROKER_REGION       = "us-east-1";


    var iotData = new AWS.IotData({endpoint: iot_config.IOT_BROKER_ENDPOINT});

    //Set the pump to 1 for activation on the device
    var payloadObj={ "state":
    { "desired":
    iot_config.IOT_DESIRED_STATE // {"pump":1}
    }
    };

    //Prepare the parameters of the update call
    var paramsUpdate = {
        "thingName" : iot_config.IOT_THING_NAME,
        "payload" : JSON.stringify(payloadObj)
    };
    // see results in IoT console, MQTT client tab, subscribe to $aws/things/YourDevice/shadow/update/delta

    //Update Device Shadow
    iotData.updateThingShadow(paramsUpdate, function(err, data) {
        if (err){
            console.log(err.toString());
        }
        else {
            console.log("success calling IoT updateThingShadow");
            callback();  // after performing Iot action, execute the caller's context.succeed function to complete
        }
    });



}