import chalk from "chalk";
import {getHost, loadingSpinner, printInfo} from "../utils.js";
import {apiGet, apiPost} from "./api.js";

export async function createHost() {
    loadingSpinner.start('Creating new host');
    const result: any = await apiPost('host/create');
    loadingSpinner.succeed(`Host created: ${result['host']}`);
}

export async function listHosts() {
    loadingSpinner.start('Loading hosts');
    const result: Array<any> = await apiGet('host/list');
    loadingSpinner.succeed();
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
    loadingSpinner.start('Deleting host');
    await apiPost('host/delete', {name: host});
    loadingSpinner.succeed(`Host deleted: ${host}`);
}