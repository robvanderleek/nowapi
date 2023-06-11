const execSync = require('child_process').execSync;
const {version} = require('../package.json');

let revision = 'main-latest';
try {
    revision = execSync('git rev-parse --short HEAD 2>/dev/null', {encoding: 'utf-8'}).trim();
} catch (e) {
    console.error('Could not retrieve version information');
}
const date = new Date().toISOString().substring(0, 10);
console.log(`export default { "version": "${version}", "revision": "${revision}", "date": "${date}"}\n`);
