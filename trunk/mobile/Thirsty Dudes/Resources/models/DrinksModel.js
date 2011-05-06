function DrinksModel()
{	
  
  var _drinkArray = null;
  var _currentDrinksPage = true;
  var _fromCat = false;
  
  this.getCurrent = function()
  {
    return _currentDrinksPage;
  };
  this.setCurrent = function( $bool )
  {
    _currentDrinksPage = $bool;
  };
  
  
  this.getFromCat = function()
  {
    return _fromCat;
  };
  this.setFromCat = function( $bool )
  {
    _fromCat = $bool;
  };
  
  
	this.getDrinks = function( )
	{
		return _drinkArray;
	};
	
	this.setDrinks = function( $drinkArray )
	{
		_drinkArray = $drinkArray;
	};
	
};

