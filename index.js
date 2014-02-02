//some code taken from http://blog.nodejitsu.com/jsdom-jquery-in-5-lines-on-nodejs/
var request = require('request'),
    jsdom = require('jsdom'),
    urlModule = require('url');

var args = process.argv;

var searchedUrls = [];
var maxDepth = 10; //limits the number of crawls
var currentDepth = 0;

if(typeof args[2] !== 'undefined' &&
   typeof args[3] !== 'undefined'){

	var startUrl = args[2];
	var stopUrl =   args[3];

	crawl(startUrl);

}else{
	console.log('Provide the sites dummy!');
} 

//performs eachLinkCallback on each jquery 'a' object found at url
function crawl(url){

	if(currentDepth <= maxDepth){

		//if this url hasn't already been crawled..
		if(searchedUrls.indexOf(url) == -1){

			console.log(url);
			request({ uri: url}, function (error, response, body) {
			  if (error && response.statusCode !== 200) {
			    console.log('Error when contacting ' + url)
			  }
			  
				jsdom.env({

				    html: body,
				    scripts: [
				      'http://code.jquery.com/jquery-1.5.min.js'
				    ],
				    done: function (err, window) {

					    var $ = window.jQuery;

					    $('a').each(function(){
					    	eachLinkCallback($(this));
					    });

					    //release the memory assosciated with this window
					    window.close();
					  }
				});
			});
		}else console.log("link already searched");

	}else{
		console.log(searchedUrls);
		console.log("crawl depth reached");
		process.exit();
	}
}

function eachLinkCallback(linkObj){

	var url = linkObj.attr('href');
	var urlObj = urlModule.parse(url);
	var formattedUrl = urlObj.hostname + urlObj.pathname; 
	searchedUrls.push(formattedUrl);
	console.log("added " + formattedUrl + " to the array");

	//if the end is reached
	if(formattedUrl == stopUrl){
		console.log("");
	}else{
		crawl("http://"+ formattedUrl); //recurse the function
		currentDepth++;
	}
}
