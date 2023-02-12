const { join } = require("path")

const db = require("better-sqlite3")(join(__dirname, "database.db"))

class Database {
    constructor() {
        db.prepare("CREATE TABLE IF NOT EXISTS projects (id INT, name TEXT, path TEXT)").run()
    }
    
    getAll = () => {
        return dbz.prepare("SELECT * FROM projects").all()
    }
    delete = id => {
        return db.prepare("DELETE FROM projects WHERE id = ?").run(id)
    }

    getId = () => {
        return (db.prepare("SELECT MAX(id) as id FROM projects").get().id+1)||1
    }

    getByName = name => {
        return db.prepare("SELECT * FROM projects WHERE name = ?").get(name)
    }

    getById = id => {
        return db.prepare("SELECT * FROM projects WHERE id = ?").get(id)
    }

    add = (name, path) => {
        db.prepare("INSERT INTO projects (id, name, path) VALUES(?, ?, ?)").run(this.getId(), name, path)
    }
}

module.exports = Database