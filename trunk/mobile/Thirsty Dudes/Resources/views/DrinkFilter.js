var win = Titanium.UI.currentWindow;
// initialize to all modes


win.orientationModes = [
	Titanium.UI.PORTRAIT
]; 

var filterTable = Titanium.UI.createTableView({
	backgroundColor: '#e5ddb7',
	separatorColor: '#f9f2d5'

});


if(Ti.Platform.name == "android") {
   filterTable.top = 20; 
}

var filterAry = [ 'Rating (High to Low)', 'Rating (Low to High)', 'Date (New to Old)', 'Date (Old to New)', 'Company (A to Z)', 'Company (Z to A)'];

var i = 0;


var memdata=[];

for ( var i=0; i< filterAry.length; i++ )
{
    var row = Titanium.UI.createTableViewRow({
    	separatorColor: '#f9f2d5',
    	backgroundSelectedColor: '#e1d6a9',
    	className: i, 
    	height: '50'
    });

    var lbl = Titanium.UI.createLabel({
    	text: filterAry[i],
    	font: {fontFamily: 'Helvetica Neue', fontSize: 16 },
    	width:180,
    	color: '#000',
    	left: 10
    });
    row.add(lbl);

    memdata.push(row);
}

if( Ti.App.catFilter == "true")
{
  // add Remove Category Filter
  var rowCat = Titanium.UI.createTableViewRow({
  	separatorColor: '#f9f2d5',
  	backgroundSelectedColor: '#e1d6a9',
  	className: 6, 
  	height: '50'
  });

  var lblCat = Titanium.UI.createLabel({
  	text: "Remove Category Filter",
  	font: {fontFamily: 'Helvetica Neue', fontSize: 16 },
  	width:180,
  	color: '#000',
  	left: 10
  });
  rowCat.add(lblCat);

  //filterTable.appendRow(rowCat);
  memdata.push(rowCat);
}


function filterClickHandler(e)
{
  Titanium.API.info("Clicked Filter button page, index is " + e.index  );
  Titanium.App.fireEvent('filterRequest', { name: e.index });
  win.close();
}
		
filterTable.data = memdata;		
		
win.add(filterTable);


/*
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
  filterTable.headerView = headerView;
  
}
*/


filterTable.addEventListener('click', filterClickHandler);