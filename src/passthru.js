const spawn = require('child_process').spawn;

const passthru = async (exe, args, options) => {
    return new Promise((resolve, reject) => {
        const child = spawn(exe, args, {
            ...options
        });
        let output = '';
        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');
        child.stdout.on('data', chunk => output += chunk);
        child.stderr.on('data', data => console.error(data));
        child.on('error', error => reject(error));
        child.on('close', _ => resolve(output));
    });
};

module.exports = passthru;
