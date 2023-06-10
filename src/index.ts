#!/usr/bin/env node
import {program} from "commander";
import 'dotenv/config';
import {login, logout, showStatus} from "./github.js";
import {createHost, deleteHost, listHosts} from "./nowapi/host.js";
import {createEndpoint, deleteEndpoint, listPaths} from "./nowapi/path.js";
import {createRequire} from "module";

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

function addHostCommands() {
    const host = program.command('host').description('Host commands');
    host
        .command('new')
        .description('Create new host')
        .action(() => createHost());
    host
        .command('list')
        .alias('ls')
        .description('List hosts')
        .action(() => listHosts());
    host
        .command('remove <host>')
        .alias('rm')
        .description('Delete host')
        .action((host) => deleteHost(host));
}

function addPathCommands() {
    const path = program.command('path').description('Path commands');
    path
        .command('set <host> <path>')
        .description('Create/update path')
        .option('-s, --status-code <number>', 'Status code', '200')
        .option('-b, --body <text>', 'Body', '')
        .action((host, path, options) => createEndpoint(host, path, parseInt(options.statusCode), options.body));
    path
        .command('list <host>')
        .alias('ls')
        .description('List paths')
        .action((host) => listPaths(host));
    path
        .command('remove <host> <path>')
        .alias('rm')
        .description('Delete path')
        .action((host, endpoint) => deleteEndpoint(host, endpoint));
}

program.name('nowapi').version(packageJson.version);
program
    .command('login')
    .description('Login with GitHub')
    .action(() => login());
program
    .command('logout')
    .description('Logout')
    .action(() => logout());
program
    .command('status')
    .description('Show status information')
    .action(() => showStatus());

addHostCommands();
addPathCommands();

program.parse(process.argv);