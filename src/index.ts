#!/usr/bin/env node
import {program} from "commander";
import 'dotenv/config';
import {login, logout, showStatus} from "./github.js";
import {createHost, deleteHost, listHosts} from "./nowapi/host.js";
import {createEndpoint, deleteEndpoint, listEndpoints, showEndpoint} from "./nowapi/endpoint.js";
import version from "./version.js";
import {loadingSpinner} from "./utils.js";

function actionErrorHandler(error: Error) {
    if (loadingSpinner.isSpinning) {
        loadingSpinner.fail(error.message);
    } else {
        program.error(error.message);
    }
}

export function actionRunner(fn: (...args: any[]) => Promise<any>) {
    return (...args: any[]) => fn(...args).catch(actionErrorHandler);
}

function addHostCommands() {
    const host = program.command('host').description('Host commands');
    host
        .command('new')
        .description('Create new host')
        .action(actionRunner(() => createHost()));
    host
        .command('list')
        .alias('ls')
        .description('List hosts')
        .action(actionRunner(() => listHosts()));
    host
        .command('remove <host>')
        .alias('rm')
        .description('Delete host')
        .action(actionRunner((host) => deleteHost(host)));
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
        .action(actionRunner((host) => listEndpoints(host)));
    endpoint
        .command('show <host> <endpoint>')
        .description('Show endpoint')
        .action(actionRunner((host, endpoint) => showEndpoint(host, endpoint)));
    endpoint
        .command('remove <host> <path>')
        .alias('rm')
        .description('Delete endpoint')
        .action(actionRunner((host, endpoint) => deleteEndpoint(host, endpoint)));
}

program.name('nowapi').version(version.version);
program
    .command('login')
    .description('Login with GitHub')
    .action(actionRunner(() => login()));
program
    .command('logout')
    .description('Logout')
    .action(() => logout());
program
    .command('status')
    .description('Show status information')
    .action(actionRunner(() => showStatus()));

addHostCommands();
addEndpointCommands();

try {
    program.parse(process.argv);
} catch (e) {
    loadingSpinner.fail(`Could not find credentials file: ${e}`);
}