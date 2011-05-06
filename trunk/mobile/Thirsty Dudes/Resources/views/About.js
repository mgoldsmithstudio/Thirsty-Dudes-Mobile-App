var win = Ti.UI.currentWindow;

win.orientationModes = [
	Titanium.UI.PORTRAIT
]; 


/*
var aboutImage = Ti.UI.createImageView({
  top:90,
  left:10,
  image:'../images/aboutBg.jpg',
  height:280,
  width:281
});
win.add(aboutImage);
*/

Ti.App.addEventListener("openURL", function(e){
  Ti.Platform.openURL(e.url);
});

var html = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN;' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>";
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
html += "<div id='about'>";


 Titanium.API.info(". Density iS -----" + Titanium.Platform.displayCaps.density);

if( Titanium.Platform.displayCaps.density == 'high')
{
  html += "<img src='images/threedudes@2x.png' width='175' height='131' style='float:right;margin:0 0 0 9px;'><p>Thirsty Dudes are a couple of bearded, awesome, thirsty, straightedge dudes who love strange drinks. All of our reviewed drinks are non-alcoholic. That's about the only thing we won't drink.</p>";

}
else
{
  html += "<img src='images/threedudes.png' width='175' height='131' style='float:right;margin:0 0 0 9px;'><p>Thirsty Dudes are a couple of bearded, awesome, thirsty, straightedge dudes who love strange drinks. All of our reviewed drinks are non-alcoholic. That's about the only thing we won't drink.</p>";

}
html += "<p>If you would like to recommend us a drink, of if you are a company that would like us to review your drink, please head over to our <a href='javascript:webCall(\"http://www.thirstydudes.com/contact\");'>contact page</a> and send us a message.";
html += "<p>Thanks and bottoms up!</p><p>Love,</br>The Thirsty Dudes</p></div></body></html>";

var webView = Ti.UI.createWebView({
  top: 0,
  left: 0,
  height: (Titanium.Platform.name == 'android' ? (Titanium.Platform.displayCaps.platformHeight-140) :340),
  backgroundColor:'transparent',
  html: "<html><body style=';padding: 10px; font-size:16px;color:#000;font-family:Helvetica Neue;'>"+html+'</body></html>'
});

win.add(webView);

var adview = Titanium.UI.createWebView({backgroundColor:'white',width:320,bottom:0,height:50,url:'ad.html'});
win.add(adview);

var numLoads = 0;
adview.addEventListener('load', function (evt) {
    numLoads++;
    if (numLoads > 1) {
        if(  evt.url.substring(0, 5) == "http:" )
        {
          Ti.Platform.openURL(evt.url);
          // now display ad again
          numLoads = 0;
          adview.url = 'ad.html';
        }
          
    }
});