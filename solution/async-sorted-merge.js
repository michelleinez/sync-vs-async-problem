'use strict'
const _ = require('lodash');

// TODO: Replace the repetition of mergesort with a binaryInsertion function.
// TODO: Figure out how to return the source index of a promise upon resolution
// without editing the asynchronous function itself.

// In the asynchronous case, when we pop an element from the LogSource Object,
// we will see delays of up to 8 milliseconds.

module.exports = (logSources, printer) => {
	const capacityLogArray = Object.keys(logSources).length;
	// Sorting helper function
	const merge = function(left, right) {
		const result  = [];
		let il = 0, ir = 0;
		while (il < left.length && ir < right.length) {
			if (left[il].date < right[ir].date){
				result.push(left[il++]);
			} else {
				result.push(right[ir++]);
			}
		}
		return result.concat(left.slice(il)).concat(right.slice(ir));
	}

	// Merge sort for sorting arrays of logs by date
	const mergeSort = function(arr) {
		// Terminal case: 0 or 1 item arrays don't need sorting
		if (arr.length < 2) {
			return arr;
		}
		const middle = Math.floor(arr.length / 2),
				left    = arr.slice(0, middle),
				right   = arr.slice(middle);
		return merge(mergeSort(left), mergeSort(right));
	}

	let emptyLogSources = 0;
	const handlePopulatedArray = function(arrayLogs) {
		let sortedArray = mergeSort(arrayLogs);
		const oldest = sortedArray.shift();
		const sourceIdx = arrayLogs.indexOf(oldest);
		if(oldest) {
			printer.print(oldest);
		} else {
			emptyLogSources++;
			if(emptyLogSources===capacityLogArray) {
				printer.done();
				return;
			}
		}
		var promise = logSources[sourceIdx].popAsync().then((log) => {
			arrayLogs[sourceIdx] = log;
			handlePopulatedArray(arrayLogs);
		});
	}

	const promises = [];
	// Generate series of promises.
	_.each(logSources, (logSourceObj, sourceIdx) => {
		promises.push(logSourceObj.popAsync());
	});

	// Execute series of promises.
	const executeAsyncMerge = () => {
		Promise.all(promises).then((res) => {
			handlePopulatedArray(res);
		});
	}

	executeAsyncMerge();
}
