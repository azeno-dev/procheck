const fs = require("fs");
const os = require("os");

let NODE_ENV = 'development';

void function main() {
    const myArgs = process.argv.slice(2);
    NODE_ENV = myArgs != null && myArgs.length > 0 ? myArgs[0] : 'development';

    let rawdata = fs.readFileSync('package.json');
    let p = JSON.parse(rawdata);
    for (var key in p) {
        if(key.toLocaleLowerCase().startsWith("version")) {
            setEnvValue("VERSION", p[key]);
            return;
        }
    }    
}();

function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    var file = ".env.development";
    console.log('NODE_ENV: ', NODE_ENV);
    if (NODE_ENV == "production") {
        file = ".env.production";
    } if (NODE_ENV == "staging") {
        file = ".env.staging";
    }

    console.log('env file: ', file);

    let fullFilePath = "./"+file;
    const ENV_VARS = fs.readFileSync(fullFilePath, "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));
    console.log('target: ', target);

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync(fullFilePath, ENV_VARS.join(os.EOL));
}
