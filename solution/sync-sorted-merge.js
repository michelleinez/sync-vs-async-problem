'use strict'

const _ = require('lodash');
const SortUtil = require('./sort-util');

module.exports = (logSources, printer) => {
  const arrayLogs = [];
  let emptyLogSources = 0;
  const capacityLogArray = Object.keys(logSources).length;

  //Populate an array with oldest log from each log source
  _.each(logSources, (logSourceObj, sourceIdx) => {
    arrayLogs.push(logSourceObj.pop());
  });

  // Sort the log objects by date
  const sortedArray = SortUtil.mergeSort(arrayLogs);

  // @function handlePopulatedArray(array)
  // @param {Array} arrayLogs Array of log objects sorted by log source index.
  // @param {Array} arrayLogs Array of the same log objects sorted by date.
  // Recursive function which prints out logs from oldest to most recent.
  const handlePopulatedArray = (arrayLogs, sortedArray) => {
    // Get the oldest log among all log sources
		const oldest = sortedArray.shift();
    // Store the index of the source of that earliest log
    // We will repopulate that position with next earliest log from that source
		const sourceIdx = arrayLogs.indexOf(oldest);
		if(oldest) {
			printer.print(oldest);
		} else {
      // If no logs are left, finish execution.
			printer.done();
			return;
		}
		const log = logSources[sourceIdx].pop();
		arrayLogs[sourceIdx] = log;
    sortedArray = SortUtil.binaryInsertion(sortedArray, log);
		handlePopulatedArray(arrayLogs, sortedArray);
	}
  handlePopulatedArray(arrayLogs, sortedArray);
}