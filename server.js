var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	serialport = require('serialport')
	SerialPort = serialport.SerialPort,
	serialPort = new SerialPort('/dev/tty.usbmodemfa131', {baudrate: 9600, parser: serialport.parsers.readline('\n')}),
	path = require('path');

server.listen(8080);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	console.log('socket connected');

	var dataBucket = {};
	var buffer = "";

	serialPort.on('data', function(data) {
		buffer += data.toString();

		//if (buffer.match(/\*\*\*>/g)) { // one full record recieved
			console.log(buffer)
			var parsedData = parseString(buffer);

			// add to current databucket
			for (var key in parsedData) {
				if (key in dataBucket) dataBucket[key].push(parsedData[key]);
				else dataBucket[key] = [parsedData[key]];
			}

			// reset buffer
			buffer = "";
		//}
 	});

	// create interval that sends the bucket every second
	setInterval(function() {
		dataBucket["time"] = (new Date()).getTime();
		socket.emit('meow', dataBucket);
		dataBucket = {};
	}, 1000);
});

// Parses string 
function parseString(buffer) {
	var start = buffer.indexOf('<***');
	var end = buffer.indexOf('***>');
	var cleaned = buffer.slice(start+4, end).split('|');
	var data = {};
	cleaned.forEach(function(pair) {
		var pieces = pair.split('=');
		data[pieces[0]] = parseInt(pieces[1]);
	});
	return data;
}