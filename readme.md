# bastionize [![Build Status](https://travis-ci.org/bendrucker/bastionize.svg?branch=master)](https://travis-ci.org/bendrucker/bastionize)

> Configure a bastion host in your ~/.ssh/config

A [bastion host](https://en.wikipedia.org/wiki/Bastion_host) is a special, limited server, typically designed to allow access to a private network from the outside. This helps you quickly bootstrap `~/.ssh/config` with settings for a single bastion and one or more targets that will use [`ProxyCommand`](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Proxies_and_Jump_Hosts). Recent releases of OpenSSH support `ProxyJump` as a simpler, more concise alternative to `ProxyCommand` and netcat.

## Install

```
$ npm install --save bastionize
```


## Usage

### API

```js
var bastionize = require('bastionize')
var fs = require('fs')

var config = fs.readFileSync(process.env.HOME + '/.ssh/config')
var bastion = {host: 'bastion.host'}
var targets = [{host: '10.10.*'}]
bastionize(config, bastion, targets, function (err, data) {
  fs.writeFileSync(process.env.HOME + '/.ssh/config', data)
})
```

### CLI

```sh
bastionize bastion.host 10.10.* --ssh-config
```

Additional flags are provided to *all* hosts, including the bastion. For example, you can set a user and identity file that will be configured for all hosts:


```sh
bastionize bastion.host 10.10.* --ssh-config --user me --identity-file ~/.ssh/me
```

You can also use stdio instead of reading/writing files:

```sh
cat ~/.ssh/config | bastionize bastion.host 10.10.*
```

## API

#### `bastionize(input, bastion, targets, callback)` -> `undefined`

##### input

*Required*  
Type: `string`

The input ssh config.

##### bastion

*Required*  
Type: `object`

The bastion configuration. `host` is required but any other attributes may be included. Everything is converted to pascal case and formatted into the output file.

##### targets

*Required*  
Type: `array[object]`

Configuration for the target hosts that will use the bastion as an ssh proxy. `host` is required but any other attributes may be included. Everything is converted to pascal case and formatted into the output file.


## License

MIT © [Ben Drucker](http://bendrucker.me)
