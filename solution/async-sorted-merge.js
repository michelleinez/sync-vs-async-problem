'use strict'

const _ = require('lodash');
const SortUtil = require('./sort-util');

// TODO: Replace the repetition of mergesort with a binaryInsertion function.
// TODO: Figure out how to return the source index of a promise upon resolution
// without editing the asynchronous function itself.

// In the asynchronous case, when we pop an element from the LogSource Object,
// we will see delays of up to 8 milliseconds.

module.exports = (logSources, printer) => {
	const capacityLogArray = Object.keys(logSources).length;

	let emptyLogSources = 0;
	const handlePopulatedArray = function(arrayLogs) {
		let sortedArray = SortUtil.mergeSort(arrayLogs);
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
