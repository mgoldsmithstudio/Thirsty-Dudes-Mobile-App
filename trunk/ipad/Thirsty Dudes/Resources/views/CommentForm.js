var win = Titanium.UI.currentWindow;
var properties = Titanium.App.Properties;
var drinkID = win.drinkID;


var imgPath = "../";

var actInd = Titanium.UI.createActivityIndicator({
	top:400
});

if (Titanium.Platform.name == 'iPhone OS') 
{
    actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
    actInd.backgroundImage = imgPath + 'images/loadBg.png';
    actInd.width = 96;
    actInd.height = 57;
}



var scrolly = Titanium.UI.createScrollView({contentHeight:'auto'});
win.add(scrolly);





var auth = Titanium.UI.createLabel({
	top:20,
	left:20,
	width:120,
	height:'auto',
	color:'#000',
	font:{fontSize:17},
	text:'Author'
});
scrolly.add(auth);

var authTF = Titanium.UI.createTextField({
	color:'#000000',
	height:35,
	top:50,
	left:20,
	width:450,
	value:(properties.hasProperty("userPin") ? properties.getString("userPin") : ''),
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrolly.add(authTF);




var email = Titanium.UI.createLabel({
	top:110,
	left:20,
	width:320,
	height:'auto',
	color:'#000',
	font:{fontSize:17},
	text:'Email'
});
scrolly.add(email);

var emailTF = Titanium.UI.createTextField({
	color:'#000000',
	height:35,
	top:140,
	left:20,
	width:450,
	value:(properties.hasProperty("emailPin") ? properties.getString("emailPin") : ''),
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrolly.add(emailTF);



var website = Titanium.UI.createLabel({
	top:200,
	left:20,
	width:320,
	height:'auto',
	color:'#000',
	font:{fontSize:17},
	text:'Website'
});
scrolly.add(website);

var websiteTF = Titanium.UI.createTextField({
	color:'#000000',
	height:35,
	top:230,
	left:20,
	width:450,
	value:(properties.hasProperty("webPin") ? properties.getString("webPin") : ''),
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrolly.add(websiteTF);




var comment = Titanium.UI.createLabel({
	top:290,
	left:20,
	width:320,
	height:'auto',
	color:'#000',
	font:{fontSize:17},
	text:'Comment'
});
scrolly.add(comment);

var commentTF = Titanium.UI.createTextArea({
	color:'#000000',
	font:{fontSize:16,fontFamily:'Helvetica Neue'},
  value:'',
	height:200,
	top:320,
	left:20,
	width:650,
	borderWidth:2,
borderColor:'#9e9e9e',
borderRadius:5
});
scrolly.add(commentTF);

var submitBtn = Titanium.UI.createButton({
		title:'Submit',
		color:'#000000',
		top:540,
		left:20,
		height:55,
		width:130
});

scrolly.add(submitBtn);



var disclaimer = Titanium.UI.createLabel({
	top:620,
	left:20,
	width:690,
	height:'auto',
	color:'#000',
	font:{fontSize:15},
	text:"We do not do anything with your email address. We use this information for spam detection because, let's face it, who likes spam? We don't want to have to take care of it as much as you don't want to read it. We use email address in conjunction with Gravatar so create an account there and let people know what you look like."

});
scrolly.add(disclaimer);


var alertDialog = Titanium.UI.createAlertDialog({
   title: "Hello thirsty dude",
   message: 'You forgot to comment!',
   buttonNames: ['OK','Doh!']
});


var submitReady = true;

function submitComment( )
{
  submitReady = true;
  
  if( commentTF.value == '' )
  {
    submitReady = false;
    
    alertDialog.show();
  }
  
  
  if( submitReady == true )
  {
    /*
    data[Comment][author]
    data[Comment][email]
    data[Comment][website]
    data[Comment][content]
    data[Comment][drink_review_id]
    */
    
    Ti.API.info("Submitting drink id " + drinkID );
    
    actInd.show();
    
    // post vars, close window
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onerror = function(e)
    {
      actInd.hide();
        Ti.UI.createAlertDialog({
            title:'Sorry',
            message:'Please try again.',
            buttonNames: ['OK']
        }).show();
    };
    xhr.onload = function() {
            //Ti.API.info(this.responseText);
            //Ti.API.info(this.status);
            if(this.status == 200) {
                //Ti.API.info('Getting back: ' + this.responseText);
                 actInd.hide();
                // now close
                win.close();
                
            } else {
                actInd.hide();
                Ti.UI.createAlertDialog({
                    title:'Sorry',
                    message:'Please try again.',
                    buttonNames: ['OK']
                }).show();
            }
        };
 
      //Ti.API.info("sending: " + jsonData);
 
      xhr.open('POST', 'http://www.thirstydudes.com/comments/add'); // index.php is just print_r($_POST) or print_r($_REQUEST)
      xhr.send({ "data[Comment][author]": authTF.value, "data[Comment][email]": emailTF.value ,    "data[Comment][website]": websiteTF.value,"data[Comment][content]": commentTF.value,"data[Comment][drink_review_id]": drinkID});

  }
  
}


submitBtn.addEventListener('click',function()
{
	submitComment();
});




function detectLayout(e)
{
 if( Titanium.Platform.displayCaps.platformWidth < Titanium.Platform.displayCaps.platformHeight )
 {
  // scrolly.width = 768;
   disclaimer.width = 690;
   win.barImage =  '../images/bar.png';
   actInd.top = 400;
 }else{
   //scrolly.width = 1024;
  disclaimer.width = 980;
   win.barImage =  '../images/bar_1024.png';
   actInd.top = 240;
 }
}




// add activity indicator
win.add(actInd);	

function openWindowHandler(e)
{
  detectLayout({orientation:Titanium.Gesture.orientation});
  
  var sn = properties.hasProperty("userPin") ? properties.getString("userPin") : 'thirsty dude';
  alertDialog.title =  'Hello ' + sn ;
  
  Titanium.API.info("OPEN Form ****** - " + properties.getString("userPin"));
  authTF.value = properties.hasProperty("userPin") ? properties.getString("userPin") : '';
  emailTF.value = properties.hasProperty("emailPin") ? properties.getString("emailPin") : '';
  websiteTF.value = properties.hasProperty("webPin") ? properties.getString("webPin") : '';
  
}

Ti.Gesture.addEventListener('orientationchange',detectLayout);
win.addEventListener('focus', openWindowHandler );
