const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);


/**
 * Main Database model - Handles CRUD functionality with lowdb
 */
class DatabaseModel {
	constructor() {
		if (!DatabaseModel.instance) {
			DatabaseModel.instance = this;
		}

		// Set default columns
		db.defaults({
			initiative: [],
			errors: []
		})
			.write();

		return DatabaseModel.instance;
	}

	/**
     * Query for entries
     * @param {string} column - column to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     */
	get(column, keyVal) {
		try {
			const result = db.get(column)
				.filter(keyVal)
				.value();

			return result;
		}
		catch (err) {
			console.log("DatabaseModel.get error:", err);
			this.error("DatabaseModel.get", err.toString());
		}
	}

	/**
     * See if entries exist already
     * @param {string} column - column to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     */
	hasEntry(column, keyVal) {
		try {
			const result = this.get(column, keyVal);
			return !!result.length;
		}
		catch (err) {
			console.log("DatabaseModel.hasEntry error:", err);
			this.error("DatabaseModel.hasEntry", err.toString());
		}
	}

	/**
     * Create an entry
     * @param {string} column - column to query
     * @param {object} data - update object
     */
	create(column, data) {
		try {
			return db.get(column)
				.push(data)
				.write();
		}
		catch (err) {
			console.log("DatabaseModel.create error:", err);
			this.error("DatabaseModel.create", err.toString());
		}

	}

	/**
     * Update an entry
     * @param {string} column - column to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     * @param {object} update - update object
     */
	update(column, keyVal, update) {
		try {
			return db.get(column)
				.find(keyVal)
				.assign(update)
				.write();
		}
		catch (err) {
			console.log("DatabaseModel.update error:", err);
			this.error("DatabaseModel.update", err.toString());
		}
	}

	/**
     * Remove an entry
     * @param {string} column - column to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     */
	delete(column, keyVal) {
		try {
			return db.get(column)
				.remove(keyVal)
				.write();
		}
		catch (err) {
			console.log("DatabaseModel.delete error:", err);
			this.error("DatabaseModel.delete", err.toString());
		}
	}

	/**
     * Clear all data from a column
     * @param {string} column - column to clear
     */
	clearColumn(column) {
		try {
			return db.set(column, [])
				.write();
		}
		catch (err) {
			console.log("DatabaseModel.clearColumn error:", err);
			this.error("DatabaseModel.clearColumn", err.toString());
		}
	}

	/**
	 * Save an error to the DB along with a timestamp and the method it occured in
	 * @param {string} method - name of method
	 * @param {string} err - thrown error via .toString()
	 */
	error(method, err) {
		return db.get("errors")
			.push({
				error: err,
				method: method,
				date: new Date().toLocaleString()
			})
			.write();
	}
}

module.exports = DatabaseModel;