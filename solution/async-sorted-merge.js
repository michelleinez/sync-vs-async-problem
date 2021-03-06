'use strict';

const _ = require('lodash');
const SortUtil = require('./sort-util');

// In the asynchronous case, when we pop an element from the LogSource Object,
// we will see delays of up to 8 milliseconds.

// NOTE: If editing of the log-source file functionality is allowed, it may be
// be better to store the logs locally and pop them one after another, however
// I have yet to find a good way to bind the source index of the log to the
// resolution of the popAsync() function without editing the function itself..

module.exports = (logSources, printer) => {
	const promises = [];
	// Generate series of promises that pop the next log from each logSource.
	_.each(logSources, (logSourceObj, sourceIdx) => {
		promises.push(logSourceObj.popAsync());
	});

	// Number of sources
	const capacityLogArray = Object.keys(logSources).length;

	// @function handlePopulatedArray(array)
	// @param {Array} arrayLogs Array of log objects sorted by log source index.
	// @param {Array} sortedArray Array of the same log objects sorted by date.
	// Recursive function which prints out and removes oldest log and replaces
	// with next oldest log from the same source.
	const handlePopulatedArray = (arrayLogs, sortedArray) => {
		// Get the oldest log among all log sources
		const oldest = sortedArray.shift();
		const sourceIdx = arrayLogs.indexOf(oldest);
		if(oldest) {
			printer.print(oldest);
		} else {
			printer.done();
			return;
		}
		// Pop logs from sources individually as they are printed out.
		const promise = logSources[sourceIdx].popAsync().then((log) => {
			arrayLogs[sourceIdx] = log;
			SortUtil.binaryInsertion(sortedArray, log)
			handlePopulatedArray(arrayLogs, sortedArray);
		});
	}

	// Execute series of promises.
	const executeAsyncMerge = () => {
		Promise.all(promises).then((arrayLogs) => {
			let sortedArray = SortUtil.mergeSort(arrayLogs);
			handlePopulatedArray(arrayLogs, sortedArray);
		});
	}

	executeAsyncMerge();
}
