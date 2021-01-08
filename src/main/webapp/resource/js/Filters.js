//filter title case
App.filter('titleCase', function() {
	return function(input) {
	  input = input || '';
	  return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};
});

App.filter('nl2br', function($filter) {
	return function(data) {
		if(!data)return data;
		return data.replace(/\n\r?/g, '<br />');
	};
});

App.filter('trim', function(){
	return function(data){
		if(!data)return data;
		return data.replace(/^\s+|\s+$/g, '');
	}
});