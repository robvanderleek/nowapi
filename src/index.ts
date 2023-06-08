#!/usr/bin/env node
import {program} from "commander";
import {login, logout, me} from "./github";
import {createHost, deleteHost, listHosts} from "./nowapi";

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
    .command('create-host')
    .description('Create new host')
    .action(() => createHost());
program
    .command('list-hosts')
    .description('List hosts')
    .action(() => listHosts());
program
    .command('delete-host <host>')
    .description('Delete host')
    .action((host) => deleteHost(host));

program.parse(process.argv);