
function DrinkVO(id, category, company, title, flavor, desc, picture, website, reviewer, date, country, sweetener, rating)
{
	var _id = id;
	var _category = category;
	var _company = company;
	var _title = title;
	var _flavor = flavor;
	var _desc = desc;
	var _picture = picture;
	var _website = website;
	var _reviewer = reviewer;
	var _date = date;
	var _country = country;
	var _sweetener = sweetener;
	var _rating = rating;
	
	this.getId = function()
	{
		return _id;
	};
	
	this.getCategory = function()
	{
		return _category;
	};
	
	this.getCompany = function()
	{
		return _company;
	};
	
	this.getTitle = function()
	{
		return _title;
	};
	
	this.getFlavor = function()
	{
		return _flavor;
	};
	
	this.getDesc = function()
	{
		return _desc;
	};
	
	this.getPicture = function()
	{
		return _picture;
	};
	
	this.getWebsite = function()
	{
		return _website;
	};
	
	this.getDateValue = function()
	{
		return _date;
	};
	
	
	this.getReviewer = function()
	{
		return _reviewer;
	};
	
	this.getCountry = function()
	{
		return _country;
	};
	
	this.getSweetener = function()
	{
		return _sweetener;
	};

	
	this.getRating = function()
	{
		return _rating;
	};


};
