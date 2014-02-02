//some code taken from http://blog.nodejitsu.com/jsdom-jquery-in-5-lines-on-nodejs/
var request = require('request'),
    jsdom = require('jsdom'),
    urlModule = require('url');

var args = process.argv;

var searchedUrls = []; //holds the urls that have been searched. Switch to 'pages' soon...
var maxDepth = 100; //limits the number of crawls
var currentDepth = 0; //holds the current depth

//if startUrl and stopUrl were included as arguments from the command-line
if(typeof args[2] !== 'undefined' &&
   typeof args[3] !== 'undefined'){

	var startUrl = args[2].replace('https://', '').replace('http://', '');
	var stopUrl  = args[3].replace('https://', '').replace('http://', '');

	//start scraping web pages recursively...
	crawl('http://' + startUrl);

}else{
	console.log('Provide the sites dummy!');
} 

//------------------------------------------------------------------------

function crawl(url){

	if(currentDepth <= maxDepth){

		request({ uri: url}, function (error, response, body) {
		  	
			if (error) {
			    console.log('Error when contacting ' + url)
			}else{
				jsdom.env({
				    html: body,
				    scripts: [
				      'http://code.jquery.com/jquery-1.5.min.js'
				    ],
				    done: function (err, window) {

					    var $ = window.jQuery;

					    $('a').each(function(){
					    	eachLinkCallback($(this), url);
					    });

					    //release the memory assosciated with this window
					    window.close();
					  }
				});
			}  
		});
	}else{
		console.log(searchedUrls);
		console.log("crawl depth reached");
		process.exit();
	}
}

function eachLinkCallback(linkObj, parentUrl){

	var url = linkObj.attr('href');
	if(typeof url !== 'undefined' &&
	   url != '' &&
	   url[0] != '.' &&
	   url[0] != '#'){

		//remove www
		url = url.replace('www.', '');

		//make relative links absolute
		if(url.substring(0, 4) != 'http'){
			if(url[0] == '/') url = url.substring(1);
			url = parentUrl + '/' + url;
		}

		// console.log(url);
		var urlObj = urlModule.parse(url);
		var formattedUrl = urlObj.hostname + urlObj.pathname; 

		//remove trailing forward slash. This has to happen after formatting the url
		if(formattedUrl.charAt( formattedUrl.length - 1 ) == "/"){
			formattedUrl = formattedUrl.slice(0, -1);
			// console.log("I DID THIS");
		}
		
		//if the end is reached
		if(formattedUrl == stopUrl){

			console.log("Found " + stopUrl);
			console.log("it took " + currentDepth + " pings");
			process.exit();

		}else if(searchedUrls.indexOf(formattedUrl) == -1){

			searchedUrls.push(formattedUrl);
			//if this url hasn't already been crawled..
			crawl("http://" + formattedUrl); //recurse the function
			currentDepth++;

		}else{
			// console.log("link already searched");
		}
	}
}
