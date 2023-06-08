#!/usr/bin/env node
import {program} from "commander";
import {login, logout, me} from "./github";
import {createHost, deleteHost, listHosts} from "./nowapi/host";
import 'dotenv/config';
import {createEndpoint, deleteEndpoint, listEndpoints} from "./nowapi/endpoint";

const packageJson = require('../package.json');

program.name('nowapi').version(packageJson.version);
program
    .command('login')
    .description('Login to GitHub')
    .action(() => login());
program
    .command('logout')
    .description('Logout from GitHub')
    .action(() => logout());
program
    .command('me')
    .description('Show current user')
    .action(() => me());
program
    .command('new [<host>]')
    .description('Create new host/endpoint')
    .action((host) => host ? createEndpoint(host) : createHost());
program
    .command('list [<host>]')
    .alias('ls')
    .description('List hosts/endpoints')
    .action((host) => host ? listEndpoints(host) : listHosts());
program
    .command('remove <host> [<endpoint>]')
    .alias('rm')
    .description('Delete host')
    .action((host, endpoint) => endpoint ? deleteEndpoint(host, endpoint) : deleteHost(host));

program.parse(process.argv);