'use strict'

const test = require('tape')
const fs = require('fs')
const child = require('child_process')
const read = require('read-all-stream')
const bastionize = require('./')

test('simple', function (t) {
  t.plan(1)

  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
  const expected = fs.readFileSync(`${__dirname}/output-simple.txt`, 'utf8')
  const bastion = {host: 'bastion.host'}
  const targets = [{host: '10.10.*', user: 'me'}]

  bastionize(input, bastion, targets, function (err, output) {
    if (err) return t.end(err)
    t.equal(output, expected)
  })
})

test('custom bastion settings', function (t) {
  t.plan(1)

  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
  const expected = fs.readFileSync(`${__dirname}/output-custom.txt`, 'utf8')
  const bastion = {host: 'bastion.host', user: 'me'}
  const targets = [{host: '10.10.*', user: 'me'}]

  bastionize(input, bastion, targets, function (err, output) {
    if (err) return t.end(err)
    t.equal(output, expected)
  })
})

test('cli', function (t) {
  t.plan(1)

  const expected = fs.readFileSync(`${__dirname}/output-custom.txt`, 'utf8')

  const spawn = child.spawn('node', [
    'cli.js',
    'bastion.host',
    '10.10.*',
    '--user',
    'me'
  ])

  read(spawn.stdout, function (err, data) {
    if (err) return t.end(err)
    t.equal(data.toString(), expected)
  })

  fs.createReadStream('input.txt').pipe(spawn.stdin)
})
