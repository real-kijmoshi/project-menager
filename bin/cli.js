#!/usr/bin/env node

const { Command } = require('commander');
const { readdirSync } = require('fs');
const updateNotifier = require('update-notifier');
const Database = require('../lib/db/database');
const pkg = require('../package.json');
const cli = new Command()

new Database().init()

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