#!/usr/bin/env node

const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))

const OK = 0
const BAD = 1

if (!args.minimum || !args.maximum || !args.settings) {
	exit('parameters required: --minimum --maximum --settings', BAD)
}
if (args._.length !== 2) {
	exit('commands required: [a|allocate|g|get|d|deallocate] [name]', BAD)
}

const command = args._[0]
const name = args._[1]
const numbers = JSON.parse(fs.readFileSync(args.settings), { encoding: 'utf8' })

if (command === 'g' || command === 'get') {
	if (typeof numbers[name] === 'number') {
		exit(numbers[name], OK)
	} else {
		exit('not found', BAD)
	}
} else if (command === 'd' || command === 'deallocate') {
	delete numbers[name]
	write()
	exit('deallocated', OK)
} else if (command === 'a' || command === 'allocate') {
	if (numbers[name]) {
		exit(numbers[name], OK)
	} else {
		const reserved = Object.keys(numbers).reduce((map, key) => {
			map[numbers[key]] = true
			return map
		}, {})
		for (var i = args.minimum; i < args.maximum; i++) {
			if (!reserved[i]) {
				numbers[name] = i
				write()
				exit(i, OK)
			}
		}
	}
} else {
	exit('command not found', BAD)
}

function write() {
	const data = JSON.stringify(numbers, undefined, 2)
	fs.writeFileSync(args.settings, data, { encoding: 'utf8' })
}

function exit(output, status) {
	process.stdout.write(output.toString())
	process.exit(status)
}
