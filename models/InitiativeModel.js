const DatabaseModel = require("./database/DatabaseModel");
const model = new DatabaseModel();

/**
 * Main Database model - Handles CRUD functionality with lowdb
 */
class InitiativeModel {
	constructor() {
		if (!InitiativeModel.instance) {
			InitiativeModel.instance = this;
		}

		this.table = "initiative";

		return InitiativeModel.instance;
	}

	/**
     * Track a player's initiative via upsert
     * @param {string} name - name of plater to track
     * @param {number} initiative - initiative roll
     */
	trackUser(name, initiative) {
		try {
			const entryExists = this.userInitiativeExists(name);
			const lowerName = name.toLowerCase();

			if (entryExists) {
				const update = { initiative: initiative };
				model.update(this.table, { id: lowerName }, update);
				return `Update ${name}'s initiative to: ${initiative}`;
			}
			else {
				const entry = { id: lowerName, initiative: initiative };
				model.create(this.table, entry);
				return `Player ${name} added to initiative tracker with initiative: ${initiative}`;
			}
		}
		catch (err) {
			console.log("InitiativeModel.trackUser error:", err);
			model.error("InitiativeModel.trackUser", err.toString());
		}
	}

	/**
     * Remove a user from the initiative tracker, if they exist
     * @param {string} name - name of player to remove
     */
	removeUser(name) {
		try {
			const entryExists = this.userInitiativeExists(name);

			// If player isn't tracked, bail
			if (!entryExists) {
				return `Player ${name} is not currently tracked!`;
			}

			const lowerName = name.toLowerCase();
			model.delete(this.table, { id: lowerName });
			return `Player ${name} removed from initiative tracker`;
		}
		catch (err) {
			console.log("InitiativeModel.removeUser error:", err);
			model.error("InitiativeModel.removeUser", err.toString());
		}
	}

	/**
     * Query user initiatives and format
     */
	getInitiatives() {
		try {
			const values = model.getTable(this.table);

			// Sort in descending order by initiative value
			const sortedValues = values.sort((a, b) => {
				return b.initiative - a.initiative;
			});

			// Format data into multiline message
			const message = sortedValues.reduce((acc, current, index) => {
				const accumulator = index === 1
					? `${acc.id} - ${acc.initiative} \n`
					: acc;
				const text = `${current.id} - ${current.initiative} \n`;

				return accumulator + text;
			});

			return message;
		}
		catch (err) {
			console.log("InitiativeModel.getInitiatives error:", err);
			model.error("InitiativeModel.getInitiatives", err.toString());
		}
	}

	/**
     * Clear all entries from the initiative table
     */
	clearInitiative() {
		try {
			model.clearTable(this.table);
			console.log("Initiative table successfully cleared");
		}
		catch (err) {
			console.log("InitiativeModel.clearInitiative error:", err);
			model.error("InitiativeModel.clearInitiative", err.toString());
		}
	}

	/**
     * Check if a player exists in the initiative tracker table
     * @param {string} name - name of player to check
     */
	userInitiativeExists(name) {
		try {
			const lowerName = name.toLowerCase();
			const keyVal = { id: lowerName };
			return model.hasEntry(this.table, keyVal);
		}
		catch (err) {
			console.log("InitiativeModel.userInitiativeExists error:", err);
			model.error("InitiativeModel.userInitiativeExists", err.toString());
		}
	}
}

module.exports = InitiativeModel;