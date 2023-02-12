const { existsSync, mkdirSync, readdirSync, writeFileSync, rmSync, rmdirSync} = require("fs");
const {join, resolve, sep} = require("path")
const { hide } = require("hidefile")
const rs = require("readline-sync")
const beautify = require("js-beautify")
const DB = require("../db/database")

const db = new DB()

const makeJsonNice = async json => {
    return await beautify(JSON.stringify(json))
}

module.exports = cli => {
    cli
        .command("init")
        .description("initialize project")
        .option("-f --force")
        .argument("[path]")
        .action(async (path, options) => {
            console.log("thank you dor using projectMenager\nwe need some info\n\n")
            if(!path) rs.question("path: ")
            const time = Date.now()
            path = (resolve(join(process.cwd(), path)));

            let curpath = ""
            path.split(sep).forEach(element => {
                curpath += (element + sep)

                if(!existsSync(curpath)) mkdirSync(curpath)
            });
            
            if(readdirSync(path)[0]){
                cli.error(path + " is not empty")
            }
            
            
            const deafultName = path.split(sep).at(-1)
            const name = rs.question(`name: (${deafultName}) `, {defaultInput: deafultName})
            
            const illegalChars = [sep, " "]
            if(illegalChars.some(char => name.includes(char))) {
                cli.error("name can't contain : \"" + illegalChars.join('", "') + "\". ")
            }
            
            if(parseInt(name).toString() == name) {
                cli.error("name can't be number")
            }
            
            if(!options.force) {
                if(db.getByName(name)) {
                    cli.error("name alredy taken\nadd --force to skip name check\nif you don't have project with this name run proj check")
                }
            }
            
            const data = {
                name: name,
                test: rs.question("test command: ", {defaultInput: "echo no test command"})
            }
            
            mkdirSync(join(path, ".proj"));
            hide(join(path, ".proj"), ()=>{})
            
            writeFileSync(join(path, ".proj", "run.json"), await makeJsonNice({test: data.test}))
            writeFileSync(join(path, ".proj", "settings.json"), await makeJsonNice({name: data.name}))
            
            try {
                db.add(name, path)
            } catch (error) {
                console.log("Error")
                rmSync(join(path, "run.json"))
                rmSync(join(path, "settings.json"))
                rmdirSync(join(path, ".proj"))
            }

            console.log("✨done in " + (Date.now() - time )+ "ms");
        })
}