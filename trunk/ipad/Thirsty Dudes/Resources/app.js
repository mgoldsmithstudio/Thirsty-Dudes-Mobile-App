// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
Titanium.include('/models/DrinksModel.js');
Titanium.include('/config/config.js');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

Ti.App.fromCatConfig = "false";
Ti.App.catFilter = "false";

// install database first
//Titanium.include('models/DatabaseModel.js');
//var databaseModel = new DatabaseModel();
//databaseModel.install();

//
// create base UI tab and root window
//


var drinksModel = new DrinksModel();

var aboutWindow = Titanium.UI.createWindow({
    url: 'views/About.js',
    title:'About',
    color:'#000',
    backgroundColor:'#e1d6a9',
    barImage: 'images/bar.png',
    barColor:"#6c5d19"
});
var aboutTab = Titanium.UI.createTab({  
    icon:'images/icon_about.png',
    title:'About',
    backgroundColor:'#e1d6a9',
    window:aboutWindow
});


var drinksWindow = Titanium.UI.createWindow({  
    category:'',
    url: 'views/Drinks.js',
    title:'Review List',
    titleColor:'#000',
    barColor:"#6c5c19",
    color:'#000',
    barImage: 'images/bar.png',
    backgroundColor:'#e1d6a9'
});
var drinksTab = Titanium.UI.createTab({  
    icon:'images/bottles.png',
    title:'Reviews',
    backgroundColor:'#e1d6a9',
    window:drinksWindow
});


var detailWindow = Titanium.UI.createWindow({
	title: 'Review',
	barImage: 'images/barBlank.png',
	barColor: '#6c5c19',
	backgroundColor:'#dfd7a9',
	url: 'views/Detail.js'
});


var categoriesWindow = Titanium.UI.createWindow({
   url: 'views/Categories.js',
    title:'Categories',
    color:'#000',
    backgroundColor:'#e1d6a9',
    barImage: 'images/bar.png',
    barColor:"#6c5d19"
});
var categoriesTab = Titanium.UI.createTab({  
    icon:'images/icon_cat.png',
    title:'Categories',
    backgroundColor:'#e1d6a9',
    window:categoriesWindow
});


var aboutWindow = Titanium.UI.createWindow({
   url: 'views/About.js',
    title:'About',
    color:'#000',
    backgroundColor:'#e1d6a9',
    barImage: 'images/bar.png',
    barColor:"#6c5d19"
});
var aboutTab = Titanium.UI.createTab({  
    icon:'images/icon_about.png',
    title:'About',
    backgroundColor:'#e1d6a9',
    window:aboutWindow
});


var settingsWindow = Titanium.UI.createWindow({
   url: 'views/Settings.js',
    title:'Settings',
    color:'#000',
    backgroundColor:'#e1d6a9',
    barImage: 'images/bar.png',
    barColor:"#6c5d19"
});
var settingsTab = Titanium.UI.createTab({  
    icon:'images/icon_preferences.png',
    title:'Settings',
    backgroundColor:'#e1d6a9',
    window:settingsWindow
});


var commentWindow = Titanium.UI.createWindow({
    url:'views/CommentForm.js',
    title:'Add Comment',
    titleColor:'#000',
    barColor:"#6c5c19",
    color:'#000',
    barImage: 'images/bar.png',
    backgroundColor:'#e1d6a9'
	});

Titanium.App.addEventListener('commentRequest', function(e) {
  Titanium.API.info("Opening COMMENT window  from APP.js " + e.drink  );
  
  commentOpen = true;
  
  commentWindow = Titanium.UI.createWindow({
    url:'views/CommentForm.js',
    title:'Add Comment',
    titleColor:'#000',
    barColor:"#6c5c19",
    color:'#000',
    barImage: 'images/bar.png',
    backgroundColor:'#e1d6a9'
	});
  
	commentWindow.drinkID = e.drink;
	drinksTab.open(commentWindow);
}); 




Titanium.App.addEventListener('detailRequest', function(e) {
	
	detailOpen = true;
	
 detailWindow = Titanium.UI.createWindow({
  	title: 'Review',
  	barImage: 'images/barBlank.png',
  	barColor: '#6c5c19',
  	backgroundColor:'#dfd7a9',
  	url: 'views/Detail.js'
  });

	detailWindow.drink = e.drink;
	drinksTab.open(detailWindow);
}); 




Titanium.App.addEventListener('categoryRequest', function(e) {
  
  Titanium.API.info("Category selected " + e.category.id );

  Ti.App.catFilter = "true";
  Ti.App.fromCatConfig = "true";
  
  Titanium.API.info("config value is " + Ti.App.fromCatConfig);
  
	drinksWindow.category = e.category.id;
	detailWindow.close();
	commentWindow.close();
	tabGroup.setActiveTab(drinksTab);
	 /*
	setTimeout(function(){

        tabGroup.setActiveTab(drinksTab);
  }, 500);
*/

  

}); 


Titanium.App.addEventListener('openURL', function(e){
    var completeURL = e.url;
    if(!(/^http:\/\//.test(completeURL)))
    {
      completeURL = "http://" + completeURL;
    }
    Titanium.Platform.openURL(completeURL);
});


//
//  add tabs
//
tabGroup.addTab(drinksTab);  

tabGroup.addTab(categoriesTab); 
tabGroup.addTab(aboutTab); 
tabGroup.addTab(settingsTab); 


// open tab group);
tabGroup.open({transition:Titanium.UI.iPhone.AnimationStyle.NONE});

