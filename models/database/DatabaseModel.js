const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const config = require("../../config.json");

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

		// Set default tables
		db.defaults(config.tables)
			.write();

		return DatabaseModel.instance;
	}

	/**
     * Query for entries
     * @param {string} table - table to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     */
	get(table, keyVal) {
		try {
			const result = db.get(table)
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
     * @param {string} table - table to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     */
	hasEntry(table, keyVal) {
		try {
			const result = this.get(table, keyVal);
			return !!result.length;
		}
		catch (err) {
			console.log("DatabaseModel.hasEntry error:", err);
			this.error("DatabaseModel.hasEntry", err.toString());
		}
	}

	/**
     * Create an entry
     * @param {string} table - table to query
     * @param {object} data - update object
     */
	create(table, data) {
		try {
			return db.get(table)
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
     * @param {string} table - table to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     * @param {object} update - update object
     */
	update(table, keyVal, update) {
		try {
			return db.get(table)
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
     * @param {string} table - table to query
     * @param {object} keyVal - key value pair to search for (ex {name: "Jace"})
     */
	delete(table, keyVal) {
		try {
			return db.get(table)
				.remove(keyVal)
				.write();
		}
		catch (err) {
			console.log("DatabaseModel.delete error:", err);
			this.error("DatabaseModel.delete", err.toString());
		}
	}

	/**
	 * Return all values in a table
	 * @param {string} table - table to query
	 */
	getTable(table) {
		try {
			return db.get(table)
				.value();
		}
		catch (err) {
			console.log("DatabaseModel.getTable error:", err);
			this.error("DatabaseModel.getTable", err.toString());
		}
	}

	/**
     * Clear all data from a table
     * @param {string} table - table to clear
     */
	clearTable(table) {
		try {
			return db.set(table, [])
				.write();
		}
		catch (err) {
			console.log("DatabaseModel.clearTable error:", err);
			this.error("DatabaseModel.clearTable", err.toString());
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