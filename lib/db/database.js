const { join } = require("path")

const db = require("better-sqlite3")(join(__dirname, "database.db"))

class Database {
    init = () => {
        try {
            db.prepare("CREATE TABLE IF NOT EXISTS projects (id INT, name TEXT, path TEXT)").run()    
        } catch (error) {
            console.clear()
            console.log("program dont have permsions to use database try using root or with sudo");
        }
    }

    getAll = () => {
        return db.prepare("SELECT * FROM projects").all()
    }

    delete = id => {
        try {
            return db.prepare("DELETE FROM projects WHERE id = ?").run(id)
        } catch (error) {
            console.clear()
            console.log("program dont have permsions to use database try using root or with sudo");
        }
    }

    getId = () => {
        return (db.prepare("SELECT MAX(id) as id FROM projects").get().id+1)||1
    }

    getByName = name => {
        return db.prepare("SELECT * FROM projects WHERE name = ?").get(name)
    }

    getByPath = path => {
        return db.prepare("SELECT * FROM projects WHERE path = ?").get(path)
    }

    getPath = project => {
        let path

        const byId = this.getById(project)
        const byName = this.getByName(project)

        if(byId){
            path = byId.path
        } else if (byName) {
            path = byName.path
        } else {
            path = process.cwd()
        }

        return path
    }

    getById = id => {
        return db.prepare("SELECT * FROM projects WHERE id = ?").get(id)
    }

    add = (name, path) => {
        try {
            db.prepare("INSERT INTO projects (id, name, path) VALUES(?, ?, ?)").run(this.getId(), name, path)
        } catch (error) {
            console.clear()
            console.log("program dont have permsions to use database try using root or with sudo");
        }
    }
}

module.exports = Database