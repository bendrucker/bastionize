'use strict'

const assert = require('assert')
const pascal = require('pascalcase-keys')
const update = require('sshconf-upsert')
const indent = require('detect-indent')

module.exports = bastionize

function bastionize (input, bastion, targets, callback) {
  assert(input, 'ssh config must be provided')
  assert(bastion.host, 'missing host: ' + JSON.stringify(bastion))

  const hosts = Targets(targets, bastion).concat(Bastion(bastion)).filter(Boolean)

  update(input, hosts, function (err, data) {
    if (err) return callback(err)
    callback(
      null,
      data
        .replace(new RegExp(indent(data).indent, 'g'), indent(input).indent)
        .replace(/\n\n$/, '\n')
    )
  })
}

function Targets (targets, bastion) {
  assert(targets, 'target hosts to use the bastion are required')

  return targets.map(function (target) {
    assert(target.host, 'missing host: ' + JSON.stringify(target))

    return Object.assign(pascal(target), {
      ProxyCommand: `ssh -t -A ${bastion.host} nc %h %p 2> /dev/null`
    })
  })
}

function Bastion (bastion) {
  assert(bastion.host, 'missing host: ' + JSON.stringify(bastion))

  if (Object.keys(bastion).length === 1) return
  return pascal(bastion)
}
