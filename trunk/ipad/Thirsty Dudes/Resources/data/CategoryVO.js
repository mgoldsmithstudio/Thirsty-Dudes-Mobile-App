
function CategoryVO(id, name, reviewCount, slug)
{
	var _id = id;
	var _name = name;
	var _reviewCount = reviewCount;
	var _slug = slug;
	
	this.getId = function()
	{
		return _id;
	};
	
	this.getName = function()
	{
		return _name;
	};
	
	this.getReviewCount = function()
	{
		return _reviewCount;
	};
	
	
	this.getSlug = function()
	{
		return _slug;
	};




};
