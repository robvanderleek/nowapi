#!/usr/bin/env node
import {program} from "commander";
import {login, logout, me} from "./github";

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
program.parse(process.argv);