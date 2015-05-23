var EventEmitter = require('events').EventEmitter
, Message = require('./message').Message
, source_line = require('./constants').source_line
, end_of_source = require('./constants').end_of_source
, line_term_regex = require('./constants').line_term_regex
, eol = require('./constants').eol
, eof = require('./constants').eof
, util = require('util')
, sourceInitialPosition = -2
, lineInitialPosition = -1
, initialIndex = 0
, initialLineNum = 0
, Source
;

exports.Source = Source = function (resource) {
	var buffer = resource.toString()
	;
	this.position = sourceInitialPosition;
	this.i = initialIndex;
	this.line = null;
	this.lineNum = initialLineNum;
	this.resource = resource;
	this.buffer = buffer.replace(line_term_regex, eol);
};

util.inherits(Source, EventEmitter);

Source.prototype.currentChar = function () {
	var position = this.position
	, line = this.line
	;

	if (position === sourceInitialPosition) {
		this.readline();
		return this.nextChar();
	}

	if (line === null) {
		return eof;
	}

	isEol = position === lineInitialPosition ||
		position === line.length;
	
	if (isEol) {
		return eol;
	}

	if (position > line.length) {
		this.readLine();
		return this.nextChar();
	}

	return line.charAt(position);
};

Source.prototype.consumeChar = function () {
	this.position++;
};

Source.prototype.nextChar = function () {
	return this.consumeChar(), this.currentChar();
};

Source.prototype.peekChar = function () {
	var position
	;

	this.currentChar();

	if (this.line === null) {
		return eof;
	}
	
	position = this.position + 1;
	
	return position < this.line.length ?
		this.line.charAt(position) :
		eol;
};

Source.prototype.send = function (payload) {
	this.emit('message', payload);
};

Source.prototype.readLine = function () {
	var j = this.i
	, buffer = this.buffer
	;

	if (j >=  buffer.length) {
		this.line = null;
		this.send(new Message(end_of_source));
		return;
	}
	for (; buffer.charAt(j) !== eol && j < buffer.length; j++) {
	}

	this.line = buffer.slice(this.i, j);
	this.lineNum++;
	this.position = lineInitialPosition;
	this.i = ++j;

	this.send(new Message(source_line, this.lineNum, this.line));
};
