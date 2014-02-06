// Copyright (c) 2014 Brannon Dorsey <brannon@brannondorsey.com>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

//some code taken from http://blog.nodejitsu.com/jsdom-jquery-in-5-lines-on-nodejs/
var request = require('request'),
    jsdom = require('jsdom'),
    urlModule = require('url');

var args = process.argv;

var searchedUrls = []; //holds the urls that have been searched. Switch to 'pages' soon...
var returnedUrls = [];
var pages = [];

var maxCrawls = 1000; //limits the number of crawls

//------------------------------------------------------------------------
//ON RUN

//if startUrl and stopUrl were included as arguments from the command-line
if(typeof args[2] !== 'undefined' &&
   typeof args[3] !== 'undefined'){

	var startUrl = args[2].replace('https://', '').replace('http://', '');
	var stopUrl  = args[3].replace('https://', '').replace('http://', '');

	//if maxCrawls param was included
	if(typeof args[4] !== 'undefined') maxCrawls = parseInt(args[4]);

	//start scraping web pages recursively...
	crawl('http://' + startUrl, pages);

}else{
	console.log('Provide the sites dummy!');
} 

//------------------------------------------------------------------------
//EVENTS

//called when stopUrl is found
function onStopUrlReached(){

	console.log("Found " + stopUrl + " (oh boy cool!)");
	console.log("Searched " + searchedUrls.length + " urls");
	console.log("Only " + returnedUrls.length + "/" + searchedUrls.length + " were returned before " + stopUrl + " was found");

	//quit the app
	process.exit();
}

//------------------------------------------------------------------------
//FUNCTIONS

function crawl(url, array){

	if(searchedUrls.length <= maxCrawls){

		request({ uri: url}, function (error, response, body) {
		  	
			if(!error &&
				response.statusCode == 200 &&
				typeof body !== 'undefined'){

				jsdom.env({
				    html: body,
				    scripts: [
				      'http://code.jquery.com/jquery-1.5.min.js'
				    ],
				    done: function (err, window) {
				    	if(typeof window.jQuery !== 'undefined'){

				    		console.log("Received: " + url);
				    		returnedUrls.push(url);
				    		
				    		var $ = window.jQuery;
				    		
						    $('a').each(function(){
						    	eachLinkCallback($(this), url, array);
						    });

						    //release the memory assosciated with this window
						    window.close();
						}
				    } 
				});

				console.log("Fetching: " + url);
			}  
		}).setMaxListeners(0); //infinity;
	}
}

//called on each anchor tag found at url
function eachLinkCallback(linkObj, parentUrl, array){

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

		var urlObj = urlModule.parse(url);
		var formattedUrl = urlObj.hostname + urlObj.pathname; 

		//remove trailing forward slash. This has to happen after formatting the url
		if(formattedUrl.charAt( formattedUrl.length - 1 ) == "/"){
			formattedUrl = formattedUrl.slice(0, -1);
		}
		
		//if the end is reached
		if(formattedUrl == stopUrl){
			array[formattedUrl] = [];
			onStopUrlReached();
		}else if(searchedUrls.indexOf(formattedUrl) == -1){

			searchedUrls.push(formattedUrl);
			array[formattedUrl] = [];

			//if this url hasn't already been crawled..
			crawl("http://" + formattedUrl, array[formattedUrl]); //recurse the function

		}
	}
}

function traverse(array, callback){

	if(array instanceof Array){
		for(var key in array){
			callback(key, array[key], array);
			traverse(array[key], callback);
		}
	}
}

function assocArrayLength(obj){

    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
