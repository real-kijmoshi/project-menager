const DB = require("../db/database")
const db = new DB()

module.exports = cli => {
    cli
        .command("projects")
        .action(() => {
            console.clear()
            console.log("\nproject list:");

            db.getAll().map(project => `id: ${project.id}\nname: ${project.name}\npath: ${project.path}\n`).forEach(project => {
                console.log(project)
            })
        })
}