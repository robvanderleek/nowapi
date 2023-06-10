import signale from "signale";
import {apiGet, apiPost} from "./api";
import {getHost, printHeader} from "../utils";
import chalk from "chalk";

export async function createHost() {
    const result = await apiPost('host/create');
    signale.info(`Host created: ${result['host']}`);
}

export async function listHosts() {
    const result = await apiGet('host/list');
    printHeader('Your hosts:');
    for (const host of result) {
        const baseUrl = `${getHost()}/api/hosts`;
        console.log(`- ${chalk.green(host)}`);
        console.log(`  ${baseUrl}/${host}`);
    }
}

export async function deleteHost(host: string) {
    await apiPost('host/delete', {name: host});
    signale.success(`Host deleted: ${host}`);
}