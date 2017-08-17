'use strict'

const _ = require('lodash')

module.exports = (logSources, printer) => {
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

  function binaryInsertion(arr, val) {
    arr.push(val);
    let i = arr.length - 1;
    const item = arr[i];
    while (i > 0 && item.date < arr[i-1].date) {
        arr[i] = arr[i-1];
        i -= 1;
    }
    arr[i] = item;
    return arr;
  }

  const arrayLogs = [];
  let emptyLogSources = 0;
  const capacityLogArray = Object.keys(logSources).length;

  //Populate an array with oldest log from each log source
  _.each(logSources, (logSourceObj, sourceIdx) => {
    arrayLogs.push(logSourceObj.pop());
  });
  // Sort the logs by date
  const sortedArray = mergeSort(arrayLogs);
  const handlePopulatedArray = (arrayLogs, sortedArray) => {
    // Get the oldest log among all log sources
		const oldest = sortedArray.shift();
    // Store the index of the source of that earliest log
    // We will repopulate that position with next earliest log from that source
		const sourceIdx = arrayLogs.indexOf(oldest);
		if(oldest) {
			printer.print(oldest);
		} else {
			printer.done();
			return;
		}
		const log = logSources[sourceIdx].pop();
		arrayLogs[sourceIdx] = log;
    sortedArray = binaryInsertion(sortedArray, log);
		handlePopulatedArray(arrayLogs, sortedArray);
	}
  handlePopulatedArray(arrayLogs, sortedArray);
}