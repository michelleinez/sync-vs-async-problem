'use strict';

// sort-util.js contains functions common to async-sorted-merge and
// sync-sorted-merge

const _ = require('lodash');

module.exports = {
  // @function merge(array)
  // @param {Array} left half of array to be merged.
  // @param {Array} right half of array to be merged.
  // @return {Array} Merged array.
  // Implementation of array merging left and right sides in mergesort
	merge: function(left, right) {
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
	},

  // @function mergeSort(array)
  // @param {Array} arr Input array.
  // @return {Array} Completely sorted array.
  // Merge sort for sorting arrays of log objects by their dates.
	mergeSort: function(arr) {
		// Terminal case: 0 or 1 item arrays don't need sorting
		if (arr.length < 2) {
			return arr;
		}
		const middle = Math.floor(arr.length / 2),
		  left = arr.slice(0, middle),
		  right = arr.slice(middle);
		return this.merge(this.mergeSort(left), this.mergeSort(right));
	},

  // @function binaryInsertion(array)
  // @param {Array} arr Input Already sorted array where log is to be inserted.
  // @param {Obj} val Log object.
  // @return {Array} Sorted array with value inserted.
  // Binary insertion implementation to insert single values into sorted arrays.
  binaryInsertion: function(arr, val) {
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
}