// includes
if (Titanium.Platform.name == 'iPhone OS') 
{ 
  Titanium.include('../config/config.js');
}
else
{
  Titanium.include('/config/config.js');
}

var win = Titanium.UI.currentWindow;
var properties = Titanium.App.Properties;
var drinkID = win.drinkID;

win.orientationModes = [
	Titanium.UI.PORTRAIT
]; 

var imgPath = "../";

var actInd = Titanium.UI.createActivityIndicator({
	top:130
});

if (Titanium.Platform.name == 'iPhone OS') 
{
    actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
    actInd.backgroundImage = imgPath + 'images/loadBg.png';
    actInd.width = 96;
    actInd.height = 57;
}
else
{
   actInd.message = "Loading data";
}

var headerView = Ti.UI.createView({
	height:80
});

var headerLabel = Ti.UI.createLabel({
	top:10,
	left:20,
	width:'auto',
	height:'auto',
	text:'Filter Results By',
	color:'black',
	shadowOffset:{x:0,y:1},
	font:{fontWeight:'bold',fontSize:22}
});
headerView.add(headerLabel);

if (Titanium.Platform.name == 'android') 
{ 
  // add header view
  //win.add(headerView);	
  
}


var scrolly = Titanium.UI.createScrollView({
  contentHeight:'auto',
  top: 0,
  left: 0
  });
win.add(scrolly);





var auth = Titanium.UI.createLabel({
	top:10,
	left:10,
	width:320,
	height:'auto',
	color:'#000',
	font:{fontSize:13},
	text:'Author'
});
scrolly.add(auth);

var authTF = Titanium.UI.createTextField({
	color:'#000000',
	height:35,
	top:30,
	left:10,
	width:250,
	font:{fontSize:14,fontFamily:'Helvetica Neue'},
	value:(properties.hasProperty("userPin") ? properties.getString("userPin") : ''),
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrolly.add(authTF);




var email = Titanium.UI.createLabel({
	top:80,
	left:10,
	width:320,
	height:'auto',
	color:'#000',
	font:{fontSize:13},
	text:'Email'
});
scrolly.add(email);

var emailTF = Titanium.UI.createTextField({
	color:'#000000',
	height:35,
	top:100,
	left:10,
	width:250,
	font:{fontSize:14,fontFamily:'Helvetica Neue'},
	value:(properties.hasProperty("emailPin") ? properties.getString("emailPin") : ''),
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrolly.add(emailTF);



var website = Titanium.UI.createLabel({
	top:150,
	left:10,
	width:320,
	height:'auto',
	color:'#000',
	font:{fontSize:13},
	text:'Website'
});
scrolly.add(website);

var websiteTF = Titanium.UI.createTextField({
	color:'#000000',
	height:35,
	top:170,
	left:10,
	width:250,
	font:{fontSize:14,fontFamily:'Helvetica Neue'},
	value:(properties.hasProperty("webPin") ? properties.getString("webPin") : ''),
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrolly.add(websiteTF);




var comment = Titanium.UI.createLabel({
	top:220,
	left:10,
	width:320,
	height:'auto',
	color:'#000',
	font:{fontSize:13},
	text:'Comment'
});
scrolly.add(comment);

var commentTF = Titanium.UI.createTextArea({
	color:'#000000',
	font:{fontSize:14,fontFamily:'Helvetica Neue'},
  value:'',
	height:100,
	top:240,
	left:10,
	width:290,
	borderWidth:2,
borderColor:'#9e9e9e',
borderRadius:5
});
scrolly.add(commentTF);

var submitBtn = Titanium.UI.createButton({
		title:'Submit',
		color:'#000000',
		top:350,
		left:10,
		height:35,
		width:90
});

scrolly.add(submitBtn);


authTF.addEventListener('return', function(){
   authTF.blur();
});

emailTF.addEventListener('return', function(){
   emailTF.blur();
});

websiteTF.addEventListener('return', function(){
   websiteTF.blur();
});


var disclaimer = Titanium.UI.createLabel({
	top:400,
	left:10,
	width:280,
	height:'auto',
	color:'#000',
	font:{fontSize:10},
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
 
      Ti.API.info("Sending!! " + drinkID);
 
      xhr.open('POST', urlPath +'comments/add'); // index.php is just print_r($_POST) or print_r($_REQUEST)
      xhr.send({ "data[Comment][author]": authTF.value, "data[Comment][email]": emailTF.value ,    "data[Comment][website]": websiteTF.value,"data[Comment][content]": commentTF.value,"data[Comment][drink_review_id]": drinkID});

  }
  
}


submitBtn.addEventListener('click',function()
{
	submitComment();
});



// add activity indicator
win.add(actInd);	

/*
var adview = Titanium.UI.createWebView({backgroundColor:'white',width:320,bottom:0,height:50,url:'ad.html'});
win.add(adview);

var numLoads = 0;
adview.addEventListener('load', function (evt) {
    numLoads++;
    if (numLoads > 1) {
        if(  evt.url.substring(0, 5) == "http:" )
        {
          Ti.Platform.openURL(evt.url);
          numLoads = 0;
          adview.url = 'ad.html';
        }
          
    }
});
*/


var sn = properties.hasProperty("userPin") ? properties.getString("userPin") : 'thirsty dude';
alertDialog.title =  'Hello ' + sn ;

Titanium.API.info("OPEN ANDROID Form ****** - DRINK ID " + drinkID);
authTF.value = properties.hasProperty("userPin") ? properties.getString("userPin") : '';
emailTF.value = properties.hasProperty("emailPin") ? properties.getString("emailPin") : '';
websiteTF.value = properties.hasProperty("webPin") ? properties.getString("webPin") : '';

