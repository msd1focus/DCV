'use strict';

App.factory('Config', [function(){
	return {
		host 			: "http://localhost:8080",
		//host 			: "http://192.168.201.38:3080", //UAT portal
		contextPath 	: "/dcv-project-master", //deploy to Tomcat
		
		/*
		uploadPath 		: "http://192.168.201.38:3080/dcv/file",
		downloadPath 	: "http://192.168.201.38:3080/dcv/file"
		*/
	};

}]);

