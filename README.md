Protocol:
	All lines begin with <*** and end with ***>
	Data for the pin is sent in the format: [MODE][PIN](optional for analog: ~MAX), where
		MODE is I for input or O for output
		PIN is the pin (i.e., A0-A5, D02-D13 on the Leonardo)
		optional: include ~MAX for analog in/out, where MAX is the maximum value for the pin
	Data for multiple pins can be sent in one line, separated by a pipe (|)

Visualization:
	Backend is made with NodeJS, Express, Socket.io, and SerialPort.
	Frontend is made with jQuery, d3, and Socket.io

	Each row is a pin. The last 60 seconds of data are shown, and then scrolled off the screen (time is on the x-axis and a timestamp is labeled for each column). Pink is for input and blue is for output. The opacity represents the average value of the pin for the last second (clear for 0, full color for MAX).

	Raw data from the serial is shown in the console of the server (in terminal)

To run:
	Requirements: nodejs

	1. Set the correct port in line 7 of server.js
	2. List the names of the pins to display in line 26 of ardVis.js
	3. Go to root folder and run "node server.js"
	4. Go to localhost:8080 in a browser.