var win = Ti.UI.currentWindow;
var properties = Titanium.App.Properties;
var data = [];
var userField;


win.orientationModes = [
	Titanium.UI.PORTRAIT
]; 


function saveSettings() {
  properties.setString('userPin',userField.value);
  properties.setString('emailPin',emailField.value);
  properties.setString('webPin',webField.value);

  var alert = Titanium.UI.createAlertDialog({
  	title:'Saved!',
  	message:'Your settings have been saved.',
  	buttonNames: ['OK']
  });
  alert.show();   
}

function buildRows() {
  data[0] = Ti.UI.createTableViewSection({headerTitle:'Comment Fields'});
	
	var userRow = Ti.UI.createTableViewRow({height:50});
	if(Ti.Platform.name != 'android') {
  	userRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	}
	userRow.className = 'control';
	
	var userLabel = Ti.UI.createLabel({
  	color:(Ti.Platform.name == "android" ? '#444' : '#444'),
  	font:{fontSize:14, fontWeight:'bold'},
  	text:"Name",
  	top:16,
  	left:10,
  	width:130,
  	height:16,
  	textAlign:'left'
  });
  userRow.add(userLabel);
  
	userField = Titanium.UI.createTextField({
		color:'#000',
		value:(properties.hasProperty("userPin") ? properties.getString("userPin") : ''),
		autocorrect:false,
		height:(Ti.Platform.name == "android" ? 40 : 30),
		top:9,
		right:20,
		width:(Ti.Platform.name == "android" ? 164 : 154),
  	font:{fontSize:14, fontWeight:'normal'}
		//clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		//borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});	
	userRow.add(userField);
	
	
	data[0].add(userRow);
	
	
	
	var emailRow = Ti.UI.createTableViewRow({height:50});
	if(Ti.Platform.name != 'android') {
  	emailRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	}
	emailRow.className = 'control';
	
	var emailLabel = Ti.UI.createLabel({
  	color:(Ti.Platform.name == "android" ? '#444' : '#444'),
  	font:{fontSize:14, fontWeight:'bold'},
  	text:"Email",
  	top:16,
  	left:10,
  	width:130,
  	height:16,
  	textAlign:'left'
  });
  emailRow.add(emailLabel);
  
	emailField = Titanium.UI.createTextField({
		color:'#000',
		value:(properties.hasProperty("emailPin") ? properties.getString("emailPin") : ''),
		autocorrect:false,
		height:(Ti.Platform.name == "android" ? 40 : 30),
		top:9,
		right:20,
		width:(Ti.Platform.name == "android" ? 164 : 154),
  	font:{fontSize:14, fontWeight:'normal'}
		//clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		//borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});	
	emailRow.add(emailField);
	
	
	data[0].add(emailRow);
	
	
	
	
	
	var webRow = Ti.UI.createTableViewRow({height:50});
	if(Ti.Platform.name != 'android') {
  	webRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	}
	webRow.className = 'control';
	
	var webLabel = Ti.UI.createLabel({
  	color:(Ti.Platform.name == "android" ? '#444' : '#444'),
  	font:{fontSize:14, fontWeight:'bold'},
  	text:"Website",
  	top:16,
  	left:10,
  	width:130,
  	height:16,
  	textAlign:'left'
  });
  webRow.add(webLabel);
  
	webField = Titanium.UI.createTextField({
		color:'#000',
		value:(properties.hasProperty("webPin") ? properties.getString("webPin") : ''),
		autocorrect:false,
		height:(Ti.Platform.name == "android" ? 40 : 30),
		top:9,
		right:20,
		width:(Ti.Platform.name == "android" ? 164 : 154),
  	font:{fontSize:14, fontWeight:'normal'}
		//clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		//borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});	
	webRow.add(webField);
	
	
	data[0].add(webRow);
	
/*
	userField.addEventListener('return', function(){
   userFieldF.blur();
 });

  emailField.addEventListener('return', function(){
    emailField.blur();
  });

  webField.addEventListener('return', function(){
     webField.blur();
  });
	*/
	
}

buildRows();

// create table view data object
var tableView = Ti.UI.createTableView({
	data:data, 	
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
	top: 0,
	height: (Titanium.Platform.name == 'android' ? (Titanium.Platform.displayCaps.platformHeight-140) :340),
  left: 0
});


if(Ti.Platform.name == "android") 
{
  
  var footerView = Ti.UI.createView({
	  height:70
  });
  
  var button = Titanium.UI.createButton({
   title: 'Save Settings',
   height:50,
   width:150
  });
  button.addEventListener('click',function(e)
  {
     saveSettings();
  });

  footerView.add(button); 
  tableView.footerView = footerView;

}

win.add(tableView);

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

var saveButton = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.SAVE});
saveButton.addEventListener('click',function(){
  saveSettings();

});
win.setLeftNavButton(saveButton);

/*
if(Ti.Platform.name == "android") {

  var tb1 = null;
 
  var menuHandler = function() {
      tb1.addEventListener('click', function() {
          saveSettings();
      });
  };
 
  var activity = Ti.Android.currentActivity;
  activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      tb1 = menu.add({title : 'Save Settings'});
      menuHandler();
  };
  
  
}
*/
