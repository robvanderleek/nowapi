#!/usr/bin/env node
import {program} from "commander";

const packageJson = require('../package.json');

program.name('nowapi').version(packageJson.version);
program.parse(process.argv);
