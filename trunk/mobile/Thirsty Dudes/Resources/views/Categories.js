// includes
if (Titanium.Platform.name == 'iPhone OS') 
{ 
  Titanium.include('../data/CategoryVO.js');
}
else
{
  Titanium.include('/data/CategoryVO.js');
}

var imgPath = "../";
var urlPath = "http://www.thirstydudes.com/";
var fromCatConfig = "false";



// global declarations
var currentWindow = Titanium.UI.currentWindow;


var categories;
var categoriesTable = Titanium.UI.createTableView({
	backgroundColor: '#e5ddb7',
	selectedBackgroundColor: '#e1d6a9',
	top:0,
	left:0,
	height: (Titanium.Platform.name == 'android' ? (Titanium.Platform.displayCaps.platformHeight-140) :340),
	separatorColor: '#f9f2d5'
});

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

currentWindow.add(categoriesTable);
currentWindow.add(actInd);


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


// functions
function createList()
{
  // first add 'all categories' that has blank slug
   var memdata=[];
   
  	var rowA = Titanium.UI.createTableViewRow({
			//className: 0, 
			selectedBackgroundColor: '#e1d6a9',
			height: '40'
		});
		
		
		var lblCategoryA = Titanium.UI.createLabel({
			text: 'All Categories',
			//font: {fontFamily: 'Helvetica Neue', fontSize: 16 },
			font: {fontSize: 16 },
			color: '#000',
			left: 10
		});

		rowA.add(lblCategoryA);

	  memdata.push(rowA);

  
  
	for (var i=0; i < categories.length; i++)
	{
	 
		
		var row = Titanium.UI.createTableViewRow({
			
			//className: categories[i].getId() + 1, 
			selectedBackgroundColor: '#e1d6a9',
			height: '40'
		});
		
		var catName = categories[i].getName();
		var reviewCountNum = categories[i].getReviewCount() + " reviews";
		
		
		var lblCategory = Titanium.UI.createLabel({
			text: catName,
			//font: {fontFamily: 'Helvetica Neue', fontSize: 16 },
			font: {fontSize: 16 },
			color: '#000',
			left: 10
		});

		var lblCount = Titanium.UI.createLabel({
			text: reviewCountNum,
			//font: {fontFamily: 'Helvetica Neue', fontSize: 11 },
			font: { fontSize: 11 },
			color: '#b09267',
      textAlign:'right',
			right: 10,
			width:65
		});
		
	
		row.add(lblCategory);
		row.add(lblCount);
		
		 //Titanium.API.info("Append ROW category ******" + categories[i].getName());
     memdata.push(row);
	 
  }
	
   categoriesTable.data = memdata;
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
	        
	        Titanium.API.info("Slug ******" + jsonObject[i].Category.slug);
	        
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

function openWindowHandler(e)
{
	getCategories();
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

// events
categoriesTable.addEventListener('click', categoriesClickHandler);

if (Titanium.Platform.name == 'android') 
{ 
  Ti.API.info("008.5 you're on ANDROID");
  getCategories();
}
else
{
  currentWindow.addEventListener('open', openWindowHandler);
  
}