// includes
if (Titanium.Platform.name == 'iPhone OS') 
{ 
  Titanium.include('../models/CategoriesModel.js');
  Titanium.include('../data/CategoryVO.js');
  Titanium.include('../config/config.js');
}
else
{
  Titanium.include('/models/CategoriesModel.js');
  Titanium.include('/data/CategoryVO.js');
  Titanium.include('/config/config.js');
}


// global declarations
var currentWindow = Titanium.UI.currentWindow;

var categoriesModel = new CategoriesModel();


var categories;
var categoriesTable = Titanium.UI.createTableView({
  top:0,
  left:0,
	backgroundColor: '#e5ddb7',
	separatorColor: '#f9f2d5'
});

var actInd = Titanium.UI.createActivityIndicator({
	
});

if (Titanium.Platform.name == 'iPhone OS') 
{
    actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
    actInd.backgroundImage = imgPath + 'images/loadBg.png';
    actInd.width = 96;
    actInd.height = 57;
}


currentWindow.add(categoriesTable);
currentWindow.add(actInd);



// functions
function createList()
{
  // first add 'all categories' that has blank slug
  
  	var rowA = Titanium.UI.createTableViewRow({
			backgroundImage: 'images/gradient.png',
			separatorColor: '#f9f2d5',
			selectedBackgroundColor: '#e1d6a9',
			className: 0, 
			height: '80'
		});
		
		
		var lblCategoryA = Titanium.UI.createLabel({
			text: 'All Categories',
			font: {fontFamily: 'Helvetica Neue', fontSize: 24 },
			color: '#000',
			left: 20
		});

		rowA.add(lblCategoryA);

	  categoriesTable.appendRow(rowA);
  
  
  
	for (var i=0; i < categories.length; i++)
	{
	 
		
		var row = Titanium.UI.createTableViewRow({
			backgroundImage: 'images/gradient.png',
			separatorColor: '#f9f2d5',
			selectedBackgroundColor: '#e1d6a9',
			className: categories[i].getId() + 1, 
			height: '80'
		});
		
		
		var lblCategory = Titanium.UI.createLabel({
			text: categories[i].getName(),
			font: {fontFamily: 'Helvetica Neue', fontSize: 24 },
			color: '#000',
			left: 20
		});

		var lblCount = Titanium.UI.createLabel({
			text: categories[i].getReviewCount() + " reviews",
			font: {fontFamily: 'Helvetica Neue', fontSize: 17 },
			color: '#b09267',
			right:20,
		  width:115
		});
		
	
		row.add(lblCategory);
		row.add(lblCount);

	  categoriesTable.appendRow(row);	
  }
	

};

function getCategories()
{
  var results = [];
  categories = [];
  
  actInd.show();
  
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
        var jsonObject = JSON.parse(this.responseText);
   

      	for (var i=0; i < jsonObject.length; i++)
	      {
	        
	       // Titanium.API.info("Slug ******" + jsonObject[i].Category.slug);
	        
		      var category = new CategoryVO( jsonObject[i].Category.id, jsonObject[i].Category.title, jsonObject[i].ReviewCount, jsonObject[i].Category.slug );
		      results.push(category);
	      }

      	for (var k=0; k < results.length; k++)
      	{
      		categories.push(results[k]);
      	}
        
        actInd.hide();
      	createList();
    };
 
  xhr.open("GET", urlPath + "categories/nav.json");
  xhr.send();


};



function categoriesClickHandler(e)
{
	if (categories.length > 0) {
	
    var slugID;
    if( e.index == 0 )
    {
      slugID = 'all';
    }
    else
    {
      slugID = categories[e.index - 1].getSlug();
    }

		Titanium.App.fireEvent('categoryRequest', { 
			category: {
					id: slugID
			}
		});

	}
};


function detectLayout(e)
{
 if( Titanium.Platform.displayCaps.platformWidth < Titanium.Platform.displayCaps.platformHeight )
 {
    actInd.top = 400;
   categoriesTable.height = Titanium.Platform.displayCaps.platformHeight - 165;
   currentWindow.barImage =  '../images/bar.png';
 }else{
   actInd.top = 240;
   categoriesTable.height = Titanium.Platform.displayCaps.platformHeight - 165;
   currentWindow.barImage =  '../images/bar_1024.png';
 }
}


function openWindowHandler(e)
{
  detectLayout({orientation:Titanium.Gesture.orientation});
	getCategories();
};


var adview = Titanium.UI.createWebView({backgroundColor:'white',width:320,bottom:0,height:50,url:'ad.html'});
currentWindow.add(adview);

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

// events
Ti.Gesture.addEventListener('orientationchange',detectLayout);
currentWindow.addEventListener('open', openWindowHandler);
categoriesTable.addEventListener('click', categoriesClickHandler);

