import chalk from "chalk";
import ora from "ora";
import {getHost, printInfo} from "../utils.js";
import {apiGet, apiPost} from "./api.js";

export async function createHost() {
    const spinner = ora({spinner: 'earth', text: 'Creating new host...', color: 'white'}).start();
    const result = await apiPost('host/create');
    spinner.succeed(`Host created: ${result['host']}`);
}

export async function listHosts() {
    const spinner = ora({spinner: 'earth', text: 'Loading hosts...', color: 'white'}).start();
    const result = await apiGet('host/list');
    spinner.succeed();
    printInfo('Your hosts:');
    for (const host of result) {
        const baseUrl = `${getHost()}/api/hosts`;
        console.log(`- ${chalk.green(host)}`);
        console.log(`  ${baseUrl}/${host}`);
    }
}

export async function deleteHost(host: string) {
    const spinner = ora({spinner: 'earth', text: 'Deleting host...', color: 'white'}).start();
    await apiPost('host/delete', {name: host});
    spinner.succeed(`Host deleted: ${host}`);
}