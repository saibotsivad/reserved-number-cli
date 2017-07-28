# reserved-number-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/saibotsivad/reserved-number-cli.svg)](https://greenkeeper.io/)

Allocate and deallocate numbers.

## install

```sh
npm install -g reserved-number-cli
```

## set up

You have to pass in three properties each time you run this:

* `--minimum` The smallest number allowed (inclusive).
* `--maximum` The biggest number allowed (inclusive).
* `--settings` The filesystem path to the JSON file storing the numbers.

The easiest way to do this is to create an alias:

```sh
alias resnum="reserved-number --minimum=4000 --maximum=6000 --settings=/path/to/settings.json"
```

## use it

If you've set it up with the alias above, you'd use it like this:

```sh
resnum [allocate|a|get|g|deallocate|d] [name]
```

### allocate number

Allocate an unused number out of the min/max range with the name `myapp`

```sh
resnum allocate myapp
resnum a myapp
```

The output will be the allocated number, if enough free numbers are available,
or an error if not enough numbers are available.

### get an allocated number

Get a previously allocated number:

```sh
resnum get myapp
resnum g myapp
```

The output will be the number, if one has been allocated for that name, or an
error if a number has not been allocated for that name.

### deallocate number

Deallocate a previously allocated number:

```
resnum deallocate myapp
resnum d myapp
```

The output is always blank.

## license

[VOL](http://veryopenlicense.com/)
