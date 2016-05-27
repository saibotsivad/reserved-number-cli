const tape = require('tape')
const spawn = require('tape-spawn')

const cmd = 'node bin.js --minimum 20 --maximum 25 --settings=./settings.json'
const OK = 0
const BAD = 1

test('must include params', 'node bin.js allocate myapp', BAD)
test('must include a command', cmd, BAD)
test('must include a name', cmd + ' allocate', BAD)

test('allocate a number', cmd + ' allocate myapp1', OK, 20)
test('allocate a number', cmd + ' a myapp2', OK, 21)

test('get a number', cmd + ' get myapp1', OK, 20)
test('get a number', cmd + ' g myapp1', OK, 20)

test('deallocate a number', cmd + ' deallocate myapp1', OK, 'deallocated')
test('deallocate a number', cmd + ' d myapp1', OK, 'deallocated')

test('number has been deallocated', cmd + ' get myapp1', BAD)

function test(message, command, expectedExitCode, expectedOutput) {
	tape(message, t => {
		const st = spawn(t, command)
		st.exitCode(expectedExitCode)
		if (expectedOutput) {
			st.stdout.match(new RegExp('^' + expectedOutput + '$'))
		}
		st.end()
	})
}
