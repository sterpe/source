jest.dontMock('../');

describe('Source', function () {
	it('creates a new Source'
		, function () {
			var Source = require('../').Source
			var EventEmitter = require('events').EventEmitter
			;
			var s = "\n";
			var source = new Source(s);
			var source2 = new Source(s);
			expect(source instanceof Source).toBe(true);
			expect(source instanceof EventEmitter).toBe(true);
			expect(source).toEqual(source2);
	});
});
