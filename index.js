
// Oliver Kovacs 2020
// sherlock-js - index.js
// MIT

const fs = require("fs");
const cp = require("child_process");

module.exports = new class Sherlock {
    constructor() {
        if (!fs.existsSync(`${__dirname}/sherlock/`)) this.install();

        this.data = require("./sherlock/sherlock/resources/data.json");
        this.config = require("./config.json");
        this.reload();
    }

    install() {
        console.log("Installing Sherlock...");
        try {
            cp.execSync(`cd ${__dirname}&git clone https://github.com/sherlock-project/sherlock`);
            cp.execSync(`cd ${__dirname}/sherlock&${this.config.python} -m pip install -r requirements.txt`);
        }
        catch (error) {
            console.log(`Error: ${error.stack}`);
        }
    }

    reload() {
        console.log("Adding custom sites...");
        for (let [ name, data ] of Object.entries(this.config.add)) {
            console.log(`Adding ${name}...`);
            this.data[name] = data;
        }
        fs.writeFileSync(`${__dirname}/sherlock/sherlock/resources/data.json`, JSON.stringify(this.data));
    }

    update() {
        console.log("Updating Sherlock...");
        this.delete();
        this.install();
        this.reload();
    }

    delete() {
        console.log("Deleting Sherlock...");
        fs.rmdirSync(`${__dirname}/sherlock/`, { recursive: true });
    }

    search(username) {
        console.log(`Searching for ${username}...`);
        if (username.includes(`"`)) {
            return console.log("Error: username invalid");       // prevent basic injections
        }

        try {
            let cmd = `cd ${__dirname}/sherlock/sherlock/&${this.config.python} sherlock.py "${username}"`;
            let out = cp.execSync(cmd).toString().split("\r\n").slice(1, -1).map((line, index) => {
                let arr1 = line.split(/\s(.+)/);
                if (index == 0) {
                    return {
                        [this.config.output.status]: arr1[0],
                        [this.config.output.name]: arr1[1].split(" ")[2]
                    };
                }
                let arr2 = arr1[1].split(/:\s(.+)/);
                return {
                    [this.config.output.status]: arr1[0],
                    [this.config.output.name]: arr2[0],
                    [this.config.output.url]: arr2[1],
                    [this.config.output.urlMain]: this.data[arr2[0]].urlMain,
                    [this.config.output.rank]: this.data[arr2[0]].rank
                };
            });

            fs.unlinkSync(`${__dirname}/sherlock/sherlock/${username}.txt`);

            return out;
        }
        catch (error) {
            console.log(`Error: ${error.stack}`);
        }
    }

    username(json) {
        return json.filter(element => element[this.config.output.status] == "[*]")[0].name;
    }

    positive(json) {
        return json.filter(element => element[this.config.output.status] == "[+]");
    }

    negative(json) {
        return json.filter(element => element[this.config.output.status] == "[-]");
    }
};