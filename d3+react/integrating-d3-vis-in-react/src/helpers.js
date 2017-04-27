// src/helpers.js
export function memoize(func, reset) {
	var memo = {};
	var slice = Array.prototype.slice;

	return function() {
		if (reset) {
			memo = {};
		}
		var args = slice.call(arguments);

		if (args in memo) {
			console.log('memo hit', args);
			return memo[args];
		} else {
			return (memo[args] = func.apply(this, args));
		}
	}
}