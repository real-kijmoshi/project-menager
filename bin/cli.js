#!/usr/bin/env node

const { Command } = require('commander');
const { readdirSync } = require('fs');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const cli = new Command()

console.clear()

updateNotifier({ pkg }).notify();

cli.version(pkg.version);
cli.name("project menager")


const createCommand = name => {
    require("../lib/commands/" + name)(cli)    
}

readdirSync(__dirname + "/../lib/commands").forEach(createCommand)

cli.parse(process.argv);
process.stdout.write("\n")