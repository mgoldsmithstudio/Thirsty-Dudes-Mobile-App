function CommentVO(id, author, email, website, content, timestamp)
{
	var _id = id;
	var _author = author;
	var _email = email;
	var _website = website;
	var _content = content;
	var _timestamp = timestamp;
	
	this.getId = function()
	{
		return _id;
	};
	
	this.getAuthor = function()
	{
		return _author;
	};
	
	this.getWebsite = function()
	{
		return _website;
	};
	
	this.getEmail = function()
	{
		return _email;
	};
	
	this.getContent = function()
	{
		return _content;
	};
	
	this.getTimestamp = function()
	{
		return _timestamp;
	};




};
