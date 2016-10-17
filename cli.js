'use strict'

const assert = require('assert')
const meow = require('meow')
const fs = require('fs')
const pify = require('pify')
const stdin = require('get-stdin')
const path = require('path')
const bastionize = require('./')

const defaultPath = path.resolve(process.env.HOME, './.ssh/config')

const readFile = pify(fs.readFile)
const writeFile = pify(fs.writeFile)

const cli = meow(`
  Usage
    $ bastionize <bastion> <targets...> --ssh-config <file>
    $ cat <file> | bastionize <bastion> <targets...>

  Examples
    $ bastionize bastion.host 10.10.* --ssh-config
    $ bastionize bastion.host 10.10.* --identity-file ~/.ssh/identity
    $ cat ~/.ssh/config | bastionize bastion.host 10.10.*
`)

var sshConfig = cli.flags.sshConfig
if (typeof sshConfig === 'string') sshConfig = defaultPath
delete cli.flags.sshConfig

const read = sshConfig
  ? readFile.bind(fs, sshConfig)
  : stdin

const write = sshConfig
  ? writeFile.bind(fs, sshConfig)
  : process.stdout.write.bind(process.stdout)

read()
  .then((config) => pify(bastionize)(
    config,
    createHost(cli.input[0]),
    cli.input.slice(1).map(createHost)
  ))
  .then(Buffer.from)
  .then(write)

function createHost (host) {
  assert(host, 'undefined host: ' + host)
  return Object.assign({host}, cli.flags)
}
