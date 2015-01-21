var page = require('webpage').create(),
    system = require('system'),
    fs = require('fs'),
    startTime, endTime, lapsedTime, address
    config = {},
    loadTime = [],
    urls = [];

/**
 * Read the configuration file and put it in global JSON
 * object.
 */
function getUrls() {
    var content = '',
        f = null,
        lines = null,
        eol = system.os.name == 'windows' ? "\r\n" : "\n";

    try {
        f = fs.open("config.properties", "r");
        content = f.read();
    } catch (e) {
        console.log(e);
    }

    if (f) {
        f.close();
    }

    if (content) {
        lines = content.split(eol);
        urls = lines[0].split(",");
        console.log(urls);
    }
}

/**
 * Write the load time of all websites from global array to
 * the text file.
 */
function writeToFile(requestTime, data) {
    var fs = require('fs');

    try {
        var fh = fs.open("Result.txt", 'a');
        var line = data.toString();
        fh.writeLine(line);
        fh.close();
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get the load time for all websites and store it in global
 * array.
 */
function measureLoadTime(address, i) {
    startTime = Date.now();
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
            lapsedTime = '0';
        } else {
            endTime = Date.now();
            lapsedTime = Date.now() - startTime;
            console.log('Loading time for ' + address + ' is ' + lapsedTime + ' msec');

        }
        setTimeout(nextUrl, 5000);
        loadTime[i] = lapsedTime;
    });
}

/**
 * Sleep for some time(MS)
 */
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

/**
 * This is main function which calls required functions
 * to measure the load time.
 */
function nextUrl() {
    if (i > urls.length - 1) {
        writeToFile(Date.now(), loadTime);
        sleep(300000);
        phantom.exit(0);
    }
    measureLoadTime(urls[i], i);
    i++;
}


/**
 * Start from here.
 */
var i = 0;
getUrls();
nextUrl();