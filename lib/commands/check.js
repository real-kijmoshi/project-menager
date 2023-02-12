const { existsSync } = require("fs")
const { join } = require("path")
const DB = require("../db/database")
const rs = require("readline-sync")

const db = new DB()

module.exports = cli => {
    cli
        .command("check")
        .action(options => {
            db.getAll().filter(proj => {
                if(["", ".proj"].some(f => !existsSync(join(proj.path, f)))) {
                    return true
                }
            }).forEach(proj => {
                const { name, path, id } = proj

                console.log(`"${path}" don't exist`);
                if(rs.keyInYN(`do you want to delete ${name}? `)) {
                    db.delete(id)
                }

                console.clear()
            })
            
            console.log("done !");
        })
}