'use strict'

const _ = require('lodash')
const Faker = require('Faker')
const P = require('bluebird')

// Although we tend to despise OOP, most real world implementations of something like a log source
// will still be in OO form, so we'll simulate that same real world interaction for now.

module.exports = class LogSource {
	constructor() {
		this.drained = false
		this.last = {
			// Set the date to some time in the past, before now.
			date: new Date(Date.now() - (1000 * 60 * 60 * 24 * _.random(40, 60))),
			msg: Faker.Company.catchPhrase()
		}
	}

	// Generates pseudo random entries for a log file
	getNextPseudoRandomEntry() {
		return {
			date: new Date(this.last.date.getTime() + (1000 * 60 * 60 * _.random(10)) + _.random(1000* 60)),
			msg: Faker.Company.catchPhrase()
		}
	}

	// Synchronously pops the LogSource object
	// and marks object as drained
	pop() {
		this.last = this.getNextPseudoRandomEntry()
		if (this.last.date > new Date()) {
			this.drained = true
		}
		return this.drained ? false : this.last
	}

	// Asynchronously pops the LogSource object via promise
	// and marks object as drained
	popAsync() {
		this.last = this.getNextPseudoRandomEntry()
		// If it was created before current time, drain the element.
		if (this.last.date > Date.now()) {
			this.drained = true
		}
		// If element wasn't drained, return it.
		return P.delay(_.random(8)).then(() => this.drained ? false : this.last)
	}
}