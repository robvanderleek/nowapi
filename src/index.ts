#!/usr/bin/env node
import {program} from "commander";
import 'dotenv/config';
import {login, logout, showStatus} from "./github.js";
import {createHost, deleteHost, listHosts} from "./nowapi/host.js";
import {createEndpoint, deleteEndpoint, listEndpoints, showEndpoint} from "./nowapi/endpoint.js";
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

function addEndpointCommands() {
    const endpoint = program.command('endpoint').description('Endpoint commands');
    endpoint
        .command('set <host> <endpoint>')
        .description('Create/update endpoint')
        .option('-s, --status-code <number>', 'Status code', '200')
        .option('-b, --body <text>', 'Body', '')
        .action((host, endpoint, options) => createEndpoint(host, endpoint, parseInt(options.statusCode), options.body));
    endpoint
        .command('list <host>')
        .alias('ls')
        .description('List endpoints')
        .action((host) => listEndpoints(host));
    endpoint
        .command('show <host> <endpoint>')
        .description('Show endpoint')
        .action((host, endpoint) => showEndpoint(host, endpoint));
    endpoint
        .command('remove <host> <path>')
        .alias('rm')
        .description('Delete endpoint')
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
addEndpointCommands();

program.parse(process.argv);