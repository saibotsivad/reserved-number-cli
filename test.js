const fs = require('fs')
const tape = require('tape')
const spawn = require('tape-spawn')
var Promise = require('promise')

const cmd = 'node bin.js --minimum 20 --maximum 22 --settings=./settings.json'
const OK = 0
const BAD = 1

testSuite('general test of behaviour', [
	['must include params', 'node bin.js allocate myapp', BAD],
	['must include a command', cmd, BAD],
	['must include a name', cmd + ' allocate', BAD],

	['allocate a number', cmd + ' allocate myapp1', OK, 20],
	['allocate a number', cmd + ' a myapp2', OK, 21],

	['get a number', cmd + ' get myapp1', OK, 20],
	['get a number', cmd + ' g myapp1', OK, 20],

	['deallocate a number', cmd + ' deallocate myapp1', OK, 'deallocated'],
	['deallocate a number', cmd + ' d myapp1', OK, 'deallocated'],

	['number has been deallocated', cmd + ' get myapp1', BAD]
])
.then(() => {
	return testSuite('allocate two, remove first, allocate first again', [
		['get a number', cmd + ' get myapp1', BAD],
		['get a number', cmd + ' get myapp2', BAD],
		['allocate a number', cmd + ' allocate myapp1', OK, 20],
		['allocate a number', cmd + ' allocate myapp2', OK, 21],
		['allocate a number', cmd + ' allocate myapp1', OK, 20]
	])
})
.then(() => {
	return testSuite('allocate more numbers than are allowed', [
		['allocate first number', cmd + ' allocate myapp1', OK, 20],
		['allocate second number', cmd + ' allocate myapp2', OK, 21],
		['allocate third number', cmd + ' allocate myapp3', OK, 22],
		['allocate too many numbers', cmd + ' allocate myapp4', BAD]
	])
})

function testSuite(message, tests) {
	fs.writeFileSync('./settings.json', JSON.stringify({}, undefined, 2), { encoding: 'utf8' })
	return Promise.all(tests.map(args => test(args[0], args[1], args[2], args[3])))
}

function test(message, command, expectedExitCode, expectedOutput) {
	return new Promise((resolve) => {
		tape(message, t => {
			const st = spawn(t, command)
			st.exitCode(expectedExitCode)
			if (expectedOutput) {
				st.stdout.match(new RegExp('^' + expectedOutput + '$'))
			}
			st.end()
			resolve()
		})
	})
}
