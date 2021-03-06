// includes
if (Titanium.Platform.name == 'iPhone OS') 
{ 
  Titanium.include('../data/CommentVO.js');
  Titanium.include('../config/config.js');
}
else
{
  Titanium.include('/data/CommentVO.js');
  Titanium.include('/config/config.js');
}

// global declarations

var currentWindow = Titanium.UI.currentWindow;
var drink = currentWindow.drink;

var commentWindow;
var commentWindowOpen = false;

currentWindow.orientationModes = [
	Titanium.UI.PORTRAIT
]; 

var drinkImage;

var html = '';


var wildWebView = Ti.UI.createWebView({
  top: 0,
  height: (Titanium.Platform.name == 'android' ? (Titanium.Platform.displayCaps.platformHeight-160) :340),
  left: 0
});

currentWindow.add(wildWebView);	

var comments = [];


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

currentWindow.add(actInd);	


var time_formats = [
  [60, 'seconds', 1], // 60
  [120, '1 minute ago', '1 minute from now'], // 60*2
  [3600, 'minutes', 60], // 60*60, 60
  [7200, '1 hour ago', '1 hour from now'], // 60*60*2
  [86400, 'hours', 3600], // 60*60*24, 60*60
  [172800, 'yesterday', 'tomorrow'], // 60*60*24*2
  [604800, 'days', 86400], // 60*60*24*7, 60*60*24
  [1209600, 'last week', 'next week'], // 60*60*24*7*4*2
  [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
  [4838400, 'last month', 'next month'], // 60*60*24*7*4*2
  [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
  [58060800, 'last year', 'next year'], // 60*60*24*7*4*12*2
  [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
  [5806080000, 'last century', 'next century'], // 60*60*24*7*4*12*100*2
  [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
];

// THIS IS IPAD APP

function prettyDate(date_str){
	var time = ('' + date_str).replace(/-/g,"/").replace(/[TZ]/g," ");

	var d = new Date( time );
	var d2 = new Date(  );
	var gmtHours = -d2.getTimezoneOffset()/60;
  var utc = d.getTime() /*+ (d.getTimezoneOffset() * 60000)*/;
  var nd = new Date(utc + (3600000*(gmtHours+7)));

	
  var seconds = (new Date - nd) / 1000;
  
  Titanium.API.info("SECONDs is now  " +   seconds);
  
  var token = 'ago', list_choice = 1;
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0, format;
  while (format = time_formats[i++]) if (seconds < format[0]) {
    if (typeof format[2] == 'string')
    {
      return format[list_choice];
    }
    else
    {
      return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
      
  }
  return time;

}


function get_gravatar(email, size)
{
    var newSize = size || 80;
    return 'http://www.gravatar.com/avatar/' + Titanium.Utils.md5HexDigest(email) + '.jpg?s=' + newSize;
}


function displayComments( )
{
  
  
  if( comments.length == 0 )
  {
    // just end html
    html += "<p><b>No Comments</b></p>";
  
    
  }
  else
  {
    
    
    
    html +='<div class="comments index">';
    html +='<h2>Comments</h2>';
    
    var num = 0;    
        
    for( var i = comments.length - 1; i >= 0; i--)
    {
      if( num == 0 )
      {
        html +='<div class="comment altrow rounded">';
      }
      else
      {
        html +='<div class="comment">';
      }
      
        html +='<div class="image">';
        html +='<img src="' + get_gravatar( comments[i].getEmail() , 50) + '" /></div>';

        html +='<div class="content">';
        html +='<div id="contentInner">';

        html +='<p class="author">'+ comments[i].getAuthor()  +'</p>';
        html +='<p class="body">'+ comments[i].getContent()  +'</p>';
        html +="<p><a href='javascript:webCall(\"" +comments[i].getWebsite() +  "\");'  >"+ comments[i].getWebsite()  +"</a></p><p>"+ prettyDate(comments[i].getTimestamp()) + "</p>";
        html +='</div>';
        html +='</div>';
      html +='</div>';
      
      
      //Ti.API.info( "COMMENT  Timestamp is " + comments[i].getTimestamp() );
      switch( num )
      {
        case 0:
          num = 1;
        break;
        case 1:
          num = 0;
        break;
      };
    }    
  
    html +="</div>";

    
  }
  
  
  

   html += "</body></html>";
  
  
  // refresh web view?
  wildWebView.html = html;
  
  actInd.hide();
} 


// functions
function createDetail()
{
  
  //Titanium.API.info("IMAGE IS NOW ((((())))) ******" + drink.picture);
  
	var drinkName = drink.company;
	
	if( drink.title != '' && drink.title != 'none' && drink.title != 'None' && drink.title != '<null>'  && drink.title != null )
	{
	  drinkName += " " + drink.title;
	}
	
	if( drink.flavor != '' && drink.flavor != 'none'  && drink.flavor != 'None' && drink.flavor != '<null>'  && drink.flavor != 'null' && drink.flavor != null )
	{
	  drinkName += " " + drink.flavor;
	}
  


html = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN;' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>";
html += "<html xmlns='http://www.w3.org/1999/xhtml'><head>";

html += "<script type='text/javascript'>";
html += "function webCall(url){";

html += "  Ti.App.fireEvent('openURL',{url:url});";
html += " }";
html += "</script>";


if (Titanium.Platform.name == 'iPhone OS') 
{ 
  html += "<link rel='stylesheet' type='text/css' href='/css/style.css' />";
}
else
{
  html += "<link rel='stylesheet' type='text/css' href='./css/style.css' />";
}


html += "</head>";
html += "<body bgcolor='#dfd7a9'>";



html += "<h3>"+ drinkName + "</h3>";
//html+=   "<iframe src='http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.thirstydudes.com%2Freview%2F" + drink.id + "&amp;layout=button_count&amp;show_faces=false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:300px; height:21px;' allowTransparency='true'></iframe>";
html += "<div id='content'><div id='detail'><img src='"+ drinkImage + "'  style='float:left;margin:0 9px 0 0;' />" + drink.desc + "</div>";
html += "<div id='info'>";
if( drink.website != '' && drink.website != null && drink.website != "none" ){
  html += "<dl><dt>Website</dt><dd><a href='javascript:webCall(\"" + drink.website +  "\");' >" + drink.website +"</a></dd></dl>";
}
if( drink.country != '' && drink.country != null && drink.country != "none" )
{
  html += "<dl><dt>Country</dt> <dd>"+ drink.country +"</dd></dl>";
}

html += "<dl><dt>Sweetener</dt><dd>"+ drink.sweetener +"</dd></dl>";  

html += "<dl><dt>Categories</dt><dd>";
for( var i = 0; i < drink.categories.length; i++)
{
  html += drink.categories[i];
  if( i != drink.categories.length - 1 )
  {
     html += ", ";
  }
}
html += "</dd></dl>";  

html += "<dl><dt>Rating</dt> <dd><span class='rating rating_"+ drink.rating +"' title='"+ drink.rating +"/5'>"+ drink.rating +"/5</span> </dd></dl>";  
html += "<dl><dt>Reviewed By</dt><dd>"+ drink.reviewer + ", " + prettyDate(drink.date) + "</dd></dl><div>";


html +="</div>";

//Ti.API.info( "Drink Timestamp is " + drink.date );
//wildWebView.html = html;
displayComments();

};









function grabComments( )
{
  
  
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
    
    actInd.hide();
    var jsonObject = JSON.parse(this.responseText);
      
      Titanium.API.info("Detail JSON photo is  " + jsonObject.DrinkReview.photo );
  
      drinkImage =   jsonObject.DrinkReview.photo;
      
    	for (var i=0; i < jsonObject.Comments.length; i++)
      {
        //Titanium.API.info("ID is " + jsonObject.Comments[i].Comment.id );
        if( jsonObject.Comments[i].Comment.status == "approved" )
        {
          var comment = new CommentVO( jsonObject.Comments[i].Comment.id, jsonObject.Comments[i].Comment.author, jsonObject.Comments[i].Comment.email, jsonObject.Comments[i].Comment.website, jsonObject.Comments[i].Comment.content, jsonObject.Comments[i].Comment.created  );
          comments.push( comment  );
        }
      }

      actInd.hide();
      createDetail();
      
      
    };

  xhr.open("GET", urlPath + "drink_reviews/detail/" + drink.id + ".json");
  xhr.send();
  actInd.show();
}

function openWindowHandler(e)
{
  Titanium.API.info("Open Detail WINDOW");
  
  wildWebView.html = '';
  currentWindow.remove(actInd);	
  currentWindow.add(actInd);	
  //currentWindow.delete(wildWebView);	
	//
	actInd.hide();
	
  grabComments( );
  
  

	//currentWindow.add(tableView);	
	
};

function blurHandler(e)
{
  actInd.hide();
}


function commentOnDrink( )
{
  /*
  commentWindow = Titanium.UI.createWindow({
    url:'CommentForm.js',
    title:'Add Comment',
    titleColor:'#000',
    barColor:"#6c5c19",
    color:'#000',
    barImage: '../images/bar.png',
    modal:true,
    backgroundColor:'#e1d6a9'
	});
	
	commentWindow.drinkID = drink.id;
	
	var b = Titanium.UI.createButton({
		title:'Close',
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	commentWindow.setLeftNavButton(b);
	b.addEventListener('click',function()
	{
	  commentWindowOpen = false;
		commentWindow.close();
	});
	

	
	if (Titanium.Platform.name == 'iPhone OS') 
  { 
	  commentWindow.open({modal:true});
  }
	else
	{
	  // hack close window first
	  commentWindow.close();
	
	  Titanium.API.info("Opening COMMENT window  ANDROID "  );
	  commentWindow.open();
	  commentWindow.show();
	}
	commentWindowOpen = true;
	*/

}

if (Titanium.Platform.name == 'iPhone OS') 
{ 
  var commentButton = Titanium.UI.createButton({
    title:'Comment', 
    color:'#ff0000',
    backgroundColor:'#e1d6a9', 
    selectedColor:'#7a744e'
    });
  Titanium.UI.currentWindow.setRightNavButton(commentButton);

  commentButton.addEventListener('click', function() {
    //commentOnDrink();
    Titanium.App.fireEvent('commentRequest', { drink: drink.id }); 
  });
}





 /*
currentWindow.addEventListener('android:back', function(e) {
    Ti.API.info("Back Button Pressed  " + commentWindowOpen);
  
    if( commentWindowOpen == true)
    {
      commentWindowOpen = false;
      commentWindow.close();
    }
    else
    {
      currentWindow.close();
    }
   
});
 */
 

var adview = Titanium.UI.createWebView({backgroundColor:'white',width:320,bottom:0,height:50,url:'ad.html'});
currentWindow.add(adview);

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


// events

if (Titanium.Platform.name == 'iPhone OS') 
{ 
  // dont call these in android
  currentWindow.addEventListener('blur', blurHandler );
  currentWindow.addEventListener('open', openWindowHandler);
}
else
{
  Titanium.API.info("Open Detail WINDOW in ANDROID");
  
  wildWebView.html = '';
	actInd.hide();
	createDetail();
  grabComments( );
  
  /*
  var activity = Ti.Android.currentActivity;
  
    // ANDROID comment button
  activity.onCreateOptionsMenu = function(e) {
    Titanium.API.info("on Create options menus");
      var menu = e.menu;
      var tb1 = menu.add({title : 'Comment'});
      tb1.addEventListener('click', function() {
         // commentOnDrink();	
        Titanium.API.info("options menu CLICK - ANDROID NEW "  );
        Titanium.App.fireEvent('commentRequest', { drink: drink.id }); 
      });
  };*/
  
  var footerView = Ti.UI.createView({
	  height:60,
	  left:0,
	  bottom:50
  });
  

  var button = Titanium.UI.createButton({
		title: 'Comment',
		font: {fontFamily: 'Helvetica Neue', fontSize: 20 },
		color: '#fff',
    backgroundImage: imgPath + 'images/BUTT_brown_off.png',
    backgroundSelectedImage: imgPath + 'images/BUTT_brown_on.png',
    backgroundDisabledImage: imgPath + 'images/BUTT_drk_off.png',
    width:301,
    height:57,
		top:0
});
  
  button.addEventListener('click',function(e)
  {
    //commentOnDrink();	
    Titanium.App.fireEvent('commentRequest', { drink: drink.id }); 
  });

  footerView.add(button); 
  currentWindow.add(footerView);
  
  
}