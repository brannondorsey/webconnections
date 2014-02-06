#Webconnections

A node.js powered command-line app for measuring the degrees of separation between webpages. Like the [wikipedia game](http://en.wikipedia.org/wiki/Wikipedia:Wiki_Game) but for the whole internet. Created for David Gondek's AI and Algorithms course at SAIC.

##Installation

Make sure that you have [node.js](http://nodejs.org) and [git](http://git-scm.com/) pre-installed.

Navigate to the parent folder of where you want webconnections to live and copy and paste this command into your terminal:

```
git clone https://github.com/brannondorsey/webconnections.git
cd webconnections
npm install
```

Oh boy you did it! Now just `cd ../` to go up a directory.

##Usage
Once downloaded and installed run the following command from the directory that contains the `webconnections/` folder.

`node webconnections startsite.com endsite.com 500`

###Where

- `startsite.com` is the web address of the site that you want to get to `end site.com` from (i.e. [`brannondorsey.com`](http://brannondorsey.com)).
- `endsite.com` is the web address that you are searching for (i.e. [google.com](http://google.com))
- `500` is the number of webpages to search before giving up. Accepts any `int` 0 to infinity.

##Results

```
Found endsite.com (oh boy cool!)
Crawled 730 urls
Only 35/730 were returned before endsite.com was found
```

Currently Webconnections only tells you how many urls it crawled before it found `endsite.com`. This means that you can use it to see if one url is even navigatable from another using only the links on the page. It does __not__ yet describe how many degrees of separation `startsite.com` and `endsite.com` are from each other nor does it illustrate the parent -> child relationship between any urls. Essentially this means it doesn't yet do what the description says that it does. But don't worry, it will soon.

##What's Coming

Soon you will be able to limit the degrees of separation in each search. In other words you'll get to include command-line parameters that tell the computer "if it takes more than 7 clicks to get between the two links then don't even try dawg." You will also be able to see the way that you would navigate between pages.

`node web connections brannondorsey.com unfoldingmaps.org`

Would return these results...

```
brannondorsey.com liquidata.org/en/ are 4 clicks apart!
Here is how you would get there...

1. brannondorsey.com/work/thisisatrackingdevice
2. unfoldingmaps.org
3. unfoldingmaps.org/exhibition/index.html
4. liquidata.org/en/

```

##Bugs
Generally something like

```
Trace
    at Socket.EventEmitter.addListener (events.js:160:15)
    at Socket.Readable.on (_stream_readable.js:689:33)
    at Socket.EventEmitter.once (events.js:179:8)
    at Request.onResponse (/Users/you/whereveryouputwebconnections/webconnections/node_modules/request/request.js:623:25)
    at ClientRequest.g (events.js:175:14)
    at ClientRequest.EventEmitter.emit (events.js:95:17)
    at HTTPParser.parserOnIncomingClient [as onIncoming] (http.js:1689:21)
    at HTTPParser.parserOnHeadersComplete [as onHeadersComplete] (http.js:120:23)
    at Socket.socketOnData [as ondata] (http.js:1584:20)
    at TCP.onread (net.js:525:27)

```

Prints all over the place in your terminal. It seems to be triggered whenever a `url` with a redirect is requested. More info [here](http://stackoverflow.com/questions/15581978/nodejs-how-to-debug-eventemitter-memory-leak-detected-11-listeners-added). I am probably not doing anything about it right now.
