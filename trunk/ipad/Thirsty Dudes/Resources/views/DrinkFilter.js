var win = Titanium.UI.currentWindow;
// initialize to all modes


var filterTable = Titanium.UI.createTableView({
	backgroundColor: '#e5ddb7',
	separatorColor: '#f9f2d5'
});

var filterAry = [ 'Rating (High to Low)', 'Rating (Low to High)', 'Date (New to Old)', 'Date (Old to New)', 'Company (A to Z)', 'Company (Z to A)'];

for (var i=0; i < filterAry.length; i++)
{
    var row = Titanium.UI.createTableViewRow({
    	separatorColor: '#f9f2d5',
    	selectedBackgroundColor: '#e1d6a9',
    	height: '100'
    });

    var lbl = Titanium.UI.createLabel({
    	text: filterAry[i],
    	font: {fontFamily: 'Helvetica Neue', fontSize: 24 },
    	width:680,
    	color: '#000',
    	left: 20
    });
    row.add(lbl);

    filterTable.appendRow(row);
}

if( Ti.App.catFilter == "true")
{
  // add Remove Category Filter
  var rowCat = Titanium.UI.createTableViewRow({
  	separatorColor: '#f9f2d5',
  	selectedBackgroundColor: '#e1d6a9',
  	height: '100'
  });

  var lblCat = Titanium.UI.createLabel({
  	text: "Remove Category Filter",
  	font: {fontFamily: 'Helvetica Neue', fontSize: 24 },
  	width:680,
  	color: '#000',
  	left: 20
  });
  rowCat.add(lblCat);

  filterTable.appendRow(rowCat);
}


function filterClickHandler(e)
{
  Titanium.App.fireEvent('filterRequest', { name: e.index });
  win.close();
}
		
win.add(filterTable);


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



function detectLayout(e)
{
 if( Titanium.Platform.displayCaps.platformWidth < Titanium.Platform.displayCaps.platformHeight )
 {
   win.barImage =  '../images/bar.png';
 }else{
   win.barImage =  '../images/bar_1024.png';
 }
}

function openWindowHandler(e)
{
  detectLayout({orientation:Titanium.Gesture.orientation});
}


Ti.Gesture.addEventListener('orientationchange',detectLayout);
win.addEventListener('focus', openWindowHandler );

filterTable.addEventListener('click', filterClickHandler);