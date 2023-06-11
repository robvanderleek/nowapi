import chalk from "chalk";
import {getHost, loadingSpinner, printInfo} from "../utils.js";
import {apiGet, apiPost} from "./api.js";

export async function createHost() {
    const spinner = loadingSpinner('Creating new host');
    const result: any = await apiPost('host/create');
    spinner.succeed(`Host created: ${result['host']}`);
}

export async function listHosts() {
    const spinner = loadingSpinner('Loading hosts');
    const result: Array<any> = await apiGet('host/list');
    spinner.succeed();
    if (result.length > 0) {
        printInfo('Your hosts:');
        for (const host of result) {
            const baseUrl = `${getHost()}/api/hosts`;
            console.log(`- ${chalk.green(host)}`);
            console.log(`  ${baseUrl}/${host}`);
        }
    } else {
        printInfo('No hosts found');
    }
}

export async function deleteHost(host: string) {
    const spinner = loadingSpinner('Deleting host');
    await apiPost('host/delete', {name: host});
    spinner.succeed(`Host deleted: ${host}`);
}