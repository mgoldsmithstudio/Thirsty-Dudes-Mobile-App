if (Titanium.Platform.name == 'iPhone OS') 
{ 
  Titanium.include('../models/DrinksModel.js');
  Titanium.include('../data/DrinkVO.js');
  Titanium.include('../config/config.js');
}
else
{
  Titanium.include('/models/DrinksModel.js');
  Titanium.include('/data/DrinkVO.js');
  Titanium.include('/config/config.js');
}

// global declarations

var currentWindow = Titanium.UI.currentWindow;
var btnGetMore;
var filterWindow;
var counter = 0;

currentWindow.orientationModes = [
	Titanium.UI.PORTRAIT
]; 
  
var drinksModel = new DrinksModel();


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



var footerView = Ti.UI.createView({
	  height:68
});
  
var drinksTable = Titanium.UI.createTableView({
	backgroundColor: '#e5ddb7',
	separatorColor: '#f9f2d5',
	top:0,
	left:0,
	height: (Titanium.Platform.name == 'android' ? (Titanium.Platform.displayCaps.platformHeight-140) :340),
	footerView:footerView
});



currentWindow.add(drinksTable);

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
          // now display ad again
          numLoads = 0;
          adview.url = 'ad.html';
        }
          
    }
});



var removed = false;
var fromCat = false;
var drinks;
var clickBoolean = false;
var parameterList = '';
var pageNumber = 1;
var totalDrinks = 0;
var results = [];



function appendDrinks()
{
  var newAry = [];
    for (var i= totalDrinks; i < drinks.length; i++)
    //for( i in drinks )
  	{
  	  var bgImg;
		
  	  switch( drinks[i].getRating() )  
  	  {
  	   case "1":
  	     bgImg = imgPath + "images/rating1.png";
  	   break;
  	   case "2":
  	     bgImg = imgPath + "images/rating2.png";
  	   break;
  	   case "3":
  	     bgImg = imgPath + "images/rating3.png";
  	   break;
  	   case "4":
  	     bgImg = imgPath + "images/rating4.png";
  	   break;
  	   case "5":
  	    bgImg =  imgPath +"images/rating5.png";
  	   break;
  	  }
		
  		var row = Titanium.UI.createTableViewRow({
  			separatorColor: '#f9f2d5',
  			backgroundSelectedColor: '#e1d6a9',
  			selectedBackgroundColor: '#e1d6a9',
  			//className: drinks[i].getId(), 
  			height: '80'
  		});
		
  		var drinkName = drinks[i].getCompany();
		
  		if( drinks[i].getTitle() != '' && drinks[i].getTitle() != 'None' && drinks[i].getTitle() != 'none' && drinks[i].getTitle() != null && drinks[i].getTitle() != 'null' )
  		{
  		  drinkName += " " + drinks[i].getTitle();
  		}
		
  		if( drinks[i].getFlavor() != '' && drinks[i].getFlavor() != 'None' && drinks[i].getFlavor() != '<null>' && drinks[i].getFlavor() != null )
  		{
  		  drinkName += " " + drinks[i].getFlavor();
  		}
  		
  		
		var drinkImg = Titanium.UI.createImageView( {

  		 image:drinks[i].getPicture(),
       width: 50,
       height: 50,
       left:10
      });
		
		
		var lblDrink = Titanium.UI.createLabel({
			text: drinkName,
			//font: {fontFamily: 'Helvetica Neue', fontSize: 14 },
			font: {fontFamily: 'Helvetica Neue', fontSize: 14 },
			width:134,
			color: '#000',
			left: 70
		});

		
	//	Ti.API.info("016");
		
		var imgRating = Titanium.UI.createImageView( {

		 image: bgImg,
     width: 90,
     height: 50,
     right: 10
    });
		
		
	    row.add(drinkImg);
  		row.add(imgRating);
  		row.add(lblDrink);
		  
		  newAry.push( row );
		
  		drinksTable.appendRow(row);	
  }
  
  // now reset total drinks
  totalDrinks = drinks.length;
  Titanium.API.info("Total DRINKS is  " + totalDrinks);
  Titanium.API.info("NEW (( data is now " + newAry.length);
  
  // disable buton if the new array is less than 9
  if( newAry.length < 10 )
  {
    btnGetMore.color = "#b0ac9b";
    btnGetMore.enabled = false;
  }
  else
  {
    btnGetMore.color = "#fff";
    btnGetMore.enabled = true;
  }
  

}


function retrieveMoreDrinks()
{
  pageNumber = pageNumber + 1;
  
  results = [];
  
  if (Titanium.Platform.name == 'iPhone OS') 
  { 
  actInd.show();
  }

  var xhr = Titanium.Network.createHTTPClient();
  
  xhr.onload = function() {
        var jsonObject = JSON.parse(this.responseText);
    
       //Ti.API.info("json object is now " + this.responseText);
       
   
      	for ( var i=0; i< jsonObject.length; i++ )
	      {
	          // run through all categories
	          var categorysArray = [];
	          for (var j=0; j < jsonObject[i].Category.length; j++)
	          {
	            categorysArray.push( jsonObject[i].Category[j].title );
	          }
	          
	          //Ti.API.info("Drink TITLe is " + jsonObject[i].Company.title);
	        
		      	var drink = new DrinkVO( jsonObject[i].DrinkReview.id, categorysArray , jsonObject[i].Company.title, jsonObject[i].DrinkTitle.title, jsonObject[i].Flavor.title, jsonObject[i].DrinkReview.body, jsonObject[i].DrinkReview.photo, jsonObject[i].Company.website, jsonObject[i].User.name, jsonObject[i].DrinkReview.created, jsonObject[i].Country.title, jsonObject[i].Sweetener.title, jsonObject[i].DrinkReview.rating  );
		        results.push(drink);
	      }
	      
	      for ( var k=0; k < results.length; k++ )
      	{
      	    Ti.API.info("Addding to drinks " + results[k]);
      		  drinks.push(results[k]);
      	}
      	
      	if (Titanium.Platform.name == 'iPhone OS') 
        {    
      	  actInd.hide();
    	  }
      	appendDrinks();
      	
      };
      
      
      Ti.API.info("Category IS " + Ti.App.category);
    
    if( Ti.App.category != '' && Ti.App.category != "all")
    {
      // get category value
      
      Ti.API.info("Category desc is now  not equal ");
      
      xhr.open("GET", urlPath + "categories/index/"+ Ti.App.category +".json?page=" + pageNumber + Ti.App.parameterList );
    }
    else
    {
       Ti.API.info("Category desc is now equal to NOTHING ");
      xhr.open("GET", urlPath + "drink_reviews/index.json?page=" + pageNumber + Ti.App.parameterList );
    
    }
    
    xhr.send();

}


var memdata=[];


// functions
function createList()
{
  Ti.API.info("Createing LIST now MEM data is refreshed");
  memdata= [ ];

  totalDrinks = drinks.length;
  for ( var i=0; i < drinks.length; i++ )
	{

	  var bgImg;
	  
	 
		
	  switch( drinks[i].getRating() )  
	  {
	   case "1":
	     bgImg =  imgPath + "images/rating1.png";
	   break;
	   case "2":
	     bgImg =  imgPath + "images/rating2.png";
	   break;
	   case "3":
	     bgImg =  imgPath + "images/rating3.png";
	   break;
	   case "4":
	     bgImg =  imgPath + "images/rating4.png";
	   break;
	   case "5":
	    bgImg =  imgPath + "images/rating5.png";
	   break;
	  }
	
	
		
		var row = Titanium.UI.createTableViewRow({
			separatorColor: '#f9f2d5',
		  backgroundSelectedColor: '#e1d6a9',
		  selectedBackgroundColor: '#e1d6a9',
			//className: counter, 
			height: '80'
		});
		
		var drinkName = drinks[i].getCompany();
		
		if( drinks[i].getTitle() != '' && drinks[i].getTitle() != 'None' && drinks[i].getTitle() != 'none' && drinks[i].getTitle() != null && drinks[i].getTitle() != 'null' )
		{
		  drinkName += " " + drinks[i].getTitle();
		}
	
		if( drinks[i].getFlavor() != '' && drinks[i].getFlavor() != 'None' && drinks[i].getFlavor() != null && drinks[i].getFlavor() != 'null' )
		{
		  drinkName += " " + drinks[i].getFlavor();
		}
		

	  
		var drinkImg = Titanium.UI.createImageView( {

  		 image:drinks[i].getPicture(),
       width: drinks[i].getPicture().substring(43,45),
       height: drinks[i].getPicture().substring(46,48),
       left:10
      });
		
		
		var lblDrink = Titanium.UI.createLabel({
			text: drinkName,
			//font: {fontFamily: 'Helvetica Neue', fontSize: 14 },
			font: { fontSize: 14 },
			width:134,
			color: '#000',
			left: 70
		});

		
	

		var imgRating = Titanium.UI.createImageView( {

		 image: bgImg,
     width: 90,
     height: 50,
     right: 10
    });
		
   
	  row.add(drinkImg);
		row.add(imgRating);
		row.add(lblDrink);
		
		memdata.push(i);

		drinksTable.appendRow(row);	
		Ti.API.info("Created Row +++++ " + counter);
		
		counter++;
  }
	
	//Ti.API.info("018");

	
   //Ti.API.info("List created for loop");

  

  //drinksTable.setData( memdata );
  //drinksTable.data = memdata;
  
  
  
  //Ti.API.info("Data and footer view set for drinks table");


  if( memdata.length > 9 )
  {
    btnGetMore.color = "#fff";
    btnGetMore.enabled = true;
  }
  else
  {
    btnGetMore.color = "#b0ac9b";
    btnGetMore.enabled = false;
  }

  drinksTable.scrollToIndex(0,{position:Titanium.UI.iPhone.TableViewScrollPosition.TOP,animated:false});
  
  
  Ti.API.info("Scroll to index");
};

btnGetMore = Titanium.UI.createButton({
		title: "Get More Reviews",
		font: {fontFamily: 'Helvetica Neue', fontSize: 20 },
		color: '#fff',
    backgroundImage: imgPath + 'images/BUTT_brown_off.png',
    backgroundSelectedImage: imgPath + 'images/BUTT_brown_on.png',
    backgroundDisabledImage: imgPath + 'images/BUTT_drk_off.png',
    width:301,
    height:57,
		top:5
});

btnGetMore.addEventListener('click',function(e)
{
  Titanium.API.info("You clicked the button");
  retrieveMoreDrinks();
});

footerView.add(btnGetMore);
drinksTable.footerView = footerView;




function createDrinkArray( $results )
{
   //Ti.API.info("---  11. CREATE DRINK ARRAY ---- ");
    for ( var k=0; k < $results.length; k++ )
	  {
		  drinks.push($results[k]);
	  }
	  
	  //Ti.API.info("---  11. SET MODEL ---- ");
	  // set model 
	  drinksModel.setDrinks( $results );
	  
	  
	 // Ti.API.info("---  11. CREATE LIST ---- ");
	  createList();
}

function getDrinks()
{

  Ti.API.info("---  1. GET DRINKS CALLED ---- ");
  
  //category = currentWindow.category;

  //currentWindow.add(actInd);

  results = [];
  drinks = [];
  
 
  if( drinksModel.getDrinks() == null || Ti.App.category != '' )
  {

    actInd.show();
    var xhr = Titanium.Network.createHTTPClient();
    
   // Ti.API.info("---  3. GET DRINKS CALLED ---- ");
    


     //Ti.API.info("---  4. GET DRINKS CALLED ---- ");
    
    xhr.onload = function() {
      
        if( removed == true )
        {
          //currentWindow.add(drinksTable);
          //currentWindow.add(actInd);
          
          removed = false;
        }
      
        var jsonObject = JSON.parse(this.responseText);
    
        //Ti.API.info("---  1. json object is now RECEIVED" );
    
        //Ti.API.info("011");

      	for ( var i=0; i< jsonObject.length; i++ )
	      {
	        
	          // run through all categories
	          var categorysArray = [];
	          

	          for ( var k=0; k< jsonObject[i].Category.length; k++ )
            {
              categorysArray.push( jsonObject[i].Category[k].title );
            }
	          
		      	var drink = new DrinkVO( jsonObject[i].DrinkReview.id, categorysArray, jsonObject[i].Company.title, jsonObject[i].DrinkTitle.title, jsonObject[i].Flavor.title, jsonObject[i].DrinkReview.body, jsonObject[i].DrinkReview.photo, jsonObject[i].Company.website, jsonObject[i].User.name, jsonObject[i].DrinkReview.created, jsonObject[i].Country.title, jsonObject[i].Sweetener.title, jsonObject[i].DrinkReview.rating  );
		        results.push(drink);
	      }
       // Ti.API.info("---  1. Completed parsing json " );
        actInd.hide();
	      createDrinkArray( results );
      };
    
     //Ti.API.info("Getting CATEGORY is " + Ti.App.category );
    
    if( Ti.App.category != '' && Ti.App.category != "all")
    {
      //// get category value
      Ti.API.info("PULL JSON ---- Category is NOT NULL and NOT ALL");
      xhr.open("GET", urlPath + "categories/index/"+ Ti.App.category +".json?page=1" + Ti.App.parameterList );
    }
    else
    {
     // Ti.API.info("PULL JSON ---- Category is NULL or ALL");
      xhr.open("GET", urlPath + "drink_reviews/index.json?page=1" + Ti.App.parameterList );
    }
   
    xhr.setTimeout(60000);
    xhr.onerror = function(e) {
        alert("Error: " + e.error);
        
        //actInd.hide();
        Ti.UI.createAlertDialog({
            title:'Sorry',
            message:'Please try again.',
            buttonNames: ['OK']
        }).show();
        
         Ti.API.info("---  2. Error ---- " + e.error);
    };
     
    //xhr.open("GET", "http://thirstydudes.mikeliterman.com/drink_reviews/index.json");
    xhr.send();
  }
  else
  {
    
    //Ti.API.info("removed  is " + removed );
    if( removed == true )
    {
      //currentWindow.add(drinksTable);
      //currentWindow.add(actInd);
      
      removed = false;
    }
    
    // model has existing data
    Titanium.API.info("model has existing data!!");
    results = drinksModel.getDrinks();
    
    createDrinkArray( results );
  }

};


function detectLayout(e)
{
  
  //Titanium.API.info("+++++ Detect Layout w - " + Titanium.Platform.displayCaps.platformWidth + " h - " + Titanium.Platform.displayCaps.platformHeight);
  if (Titanium.Platform.name == 'android') 
  { 
     if( Titanium.Platform.displayCaps.platformWidth < Titanium.Platform.displayCaps.platformHeight )
     {
       btnGetMore.left = Titanium.Platform.displayCaps.platformWidth / 2 -  150;
      // Titanium.API.info("+++++ Width Less than Height");
     }else{
       btnGetMore.left = Titanium.Platform.displayCaps.platformWidth / 2 -  150;
      // Titanium.API.info("+++++ Width greater then Height " + btnGetMore.left);
     }
 }
}


function openWindowHandler(e)
{
  detectLayout({orientation:Titanium.Gesture.orientation});
  Titanium.API.info("OPEN DRINKS PAGE ****** ");
  //Titanium.API.info(". drinksModel.getCurrent ****** " + drinksModel.getCurrent());
  //Titanium.API.info(". filterWindowUp ****** " + Ti.App.filterWindowUp);
  
  //Titanium.API.info(". CAT CONFIG -----" + Ti.App.fromCatConfig);
  
  //Titanium.API.info(" NOW active tab is " + Titanium.UI.currentTab.title );
  
  //Titanium.API.info("Open Window from cat value is " + fromCat);

  if( drinksModel.getCurrent() == true  && Ti.App.filterWindowUp == false && Ti.App.fromCatConfig == "false"  )
  {
     // Titanium.API.info("OPEN DRINKS PAGE-------- AND NOW GET DRINKS ******");
    	getDrinks();
  } 
  
  if( Ti.App.fromCatConfig  == "true" )
  {
    Ti.App.fromCatConfig = "false";
    //Titanium.API.info("FROM CAT!! ******");
    getDrinks();
  }

  // set back to true
  drinksModel.setCurrent( true );
  
  
  // reset to false
  Ti.App.filterWindowUp = false;

};

function drinkClickHandler(e)
{
  Titanium.API.info("E INDEX is " + e.index);
  clickBoolean = true;
  
	if (drinks.length > 0) {
	
	  drinksModel.setCurrent( false );
	
		Titanium.App.fireEvent('detailRequest', { 
			drink: {
					id: drinks[e.index].getId(),
					categories: drinks[e.index].getCategory(),
					company: drinks[e.index].getCompany(),
					title: drinks[e.index].getTitle(),
					flavor: drinks[e.index].getFlavor(),
					desc: drinks[e.index].getDesc(),
					picture: drinks[e.index].getPicture(),
					reviewer: drinks[e.index].getReviewer(),
					date: drinks[e.index].getDateValue(),
					website: drinks[e.index].getWebsite(),
					country: drinks[e.index].getCountry(),
					sweetener: drinks[e.index].getSweetener(),
					rating: drinks[e.index].getRating()
			}
		});
	
	}
};

function blurHandler(e)
{
  //Titanium.API.info(" active tab is " + Titanium.UI.currentTab.title );
  
  //actInd.hide();
  
  // only if leaving Drinks section, remove data
  if( drinksModel.getCurrent() == true && Ti.App.filterWindowUp == false )
  {
    
      Titanium.API.info("REMOVE TABLE ******");
      removed = true;
      drinksTable.setData([]);
   

  
      drinks = [];
      //currentWindow.remove(drinksTable);
  }

};


function sortList( $filter )
{
  Titanium.API.info("Filter drinks by ******" + $filter );

  switch( $filter )
  {
    case 0:
      //Rating (High to Low)
      Ti.App.parameterList = "&sort=DrinkReview.rating&direction=desc";
    break;
    case 1:
      //Rating (Low to High)
      Ti.App.parameterList = "&sort=DrinkReview.rating&direction=asc";
    break;
    case 2:
      //Date - (New to Old)
      Ti.App.parameterList = "&sort=DrinkReview.created&direction=desc";
    break;
    case 3:
      //Date (Old to New)
      Ti.App.parameterList = "&sort=DrinkReview.created&direction=asc";
    break;
    case 4:
      //Company (A to Z)
      Ti.App.parameterList = "&sort=Company.title&direction=asc";
    break;
    case 5:
      //Company (Z to A)
      Ti.App.parameterList = "&sort=Company.title&direction=desc";
    break;
    case 6:
      // REMOVE Category Filter
      Ti.App.catFilter = false;
      Ti.App.category = '';
      Ti.App.parameterList = "";
    break;
  }
  
  // reset values 
  // set drinks to empty array
  drinksModel.setDrinks( null );
  drinks = [];
  removed = true;
  //currentWindow.remove(actInd);
  drinksTable.setData([]);
  

  
  //currentWindow.remove(drinksTable);
  pageNumber = 1;
  totalDrinks = 0;
  
  // now get new drinks
  getDrinks();
  
}



function addFilterWindow( )
{
  //Titanium.App.fireEvent('filterOpenRequest', {  }); 
  Titanium.API.info("OPEN FILTER WINDOW ****** ");

  Ti.App.filterWindowUp = true;
  

  filterWindow = Titanium.UI.createWindow({
    url:'DrinkFilter.js',
    title:'Filter Reviews By',
    titleColor:'#000',
    barColor:"#6c5c19",
    color:'#000',
    barImage: '../images/bar.png',
    backgroundColor:'#e1d6a9'
		
	});

	if (Titanium.Platform.name == 'iPhone OS') 
  { 
    
    	var b = Titanium.UI.createButton({
    		title:'Close'
    	});
    	if (Titanium.Platform.name == 'iPhone OS') 
      {
        b.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
      }  
	
    	filterWindow.setLeftNavButton(b);
    	b.addEventListener('click',function()
    	{
    	  filterWindowUp = false;
    		filterWindow.close();
    	});
    
    
	  filterWindow.open({ modal:true,
        modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
        modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN
      });
  }
	else
	{
	  filterWindow.open({   modal:true,
        modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
        modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN
      });
	}
  
}



if (Titanium.Platform.name == 'iPhone OS') 
{ 
    
  var filterButton = Titanium.UI.createButton({
    title:'Filter', 
    color:'#ff0000',
    backgroundColor:'#e1d6a9', 
    selectedColor:'#7a744e'
    });
  Titanium.UI.currentWindow.setLeftNavButton(filterButton);

  filterButton.addEventListener('click', function() {
    addFilterWindow();
  });
}

Titanium.App.addEventListener('filterRequest', function(e) {
  Titanium.API.info("Filter request Called ****** ");
	sortList( e.name );
}); 



Titanium.App.addEventListener('categoryRequest', function(e) 
{
  if (Titanium.Platform.name == 'android') 
  { 
    Ti.API.info("CAT REQUEST you're on ANDROID");
    
    drinksModel.setDrinks( null );
    drinksTable.setData([]);
   
    
    
    drinks = [];
    removed = true;
    //currentWindow.remove(actInd);
    //currentWindow.remove(drinksTable);
    pageNumber = 1;
    totalDrinks = 0;
    
    
  	setTimeout(function(){
        getDrinks();
    }, 300);
    
  }
}); 



if(Ti.Platform.name == "android") {
  
  var tb1 = null;
 
  var menuHandler = function() {
      tb1.addEventListener('click', function() {
          addFilterWindow();
      });
  };
 
  var activity = Ti.Android.currentActivity;
  activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      tb1 = menu.add({title : 'Filter'});
      menuHandler();
  };
}


Ti.Gesture.addEventListener('orientationchange',detectLayout);
// events


drinksTable.addEventListener('click', drinkClickHandler);

if (Titanium.Platform.name == 'iPhone OS') 
{ 
  currentWindow.addEventListener('focus', openWindowHandler );
  currentWindow.addEventListener('blur', blurHandler );
}
else
{
  currentWindow.addEventListener('open', openWindowHandler );
}



/*
if (Titanium.Platform.name == 'android') 
{ 
  Ti.API.info("008.5 you're on ANDROID");
  getDrinks();
  detectLayout({orientation:Titanium.Gesture.orientation});
  
}*/
