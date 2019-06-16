const items = require("../data/items.json");
const cloneDeep = require("lodash.clonedeep");
const DatabaseModel = require("./database/DatabaseModel");
const dbModel = new DatabaseModel();


/**
 * Interface with item JSON - Item JSON contains more data
 * than the DnD API used by './utils/query'
 */
class ItemModel {
	constructor() {
		if (!ItemModel.instance) {
			ItemModel.instance = this;
		}

		this.items = items.compendium.item;

		return ItemModel.instance;
	}

	/**
     * Format item names for easy searching
     * @param {string} itemName
     */
	formatName(itemName) {
		try {
			// Replace spaces with dashes and lowercase
			// ex. 'Iron Spear' to 'iron-spear'
			const lowerDashed = itemName.replace(/\s+/g, "-").toLowerCase();
			return lowerDashed;
		}
		catch (err) {
			dbModel.error("ItemModel.formatName", err.toString());
			throw err;
		}
	}

	/**
     * Massage data into readable format & add line breaks
     * @param {object} item
     */
	formatItemMessage(item) {
		try {
			// Clone spell object to prevent mutation
			const itemCopy = cloneDeep(item);

			if (Array.isArray(itemCopy.text)) {
				itemCopy.text = itemCopy.text.join();
			}

			// Set max length of description of a item to 1500 characters
			// Discord can only send 2000 characters per message
			// TODO: Implement better handling for long item text
			if (itemCopy.text && (itemCopy.text.length > 1500)) {
				itemCopy.text = itemCopy.text.slice(0, 1500) + "... \n **(Item description over character limit)**";
			}

			// Format keys correct and add line breaks
			const message = Object.keys(itemCopy).map(key => {
				let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
				capitalizedKey = capitalizedKey.replace(/_/g, " ");
				return `${capitalizedKey}: ${itemCopy[key]}`;
			}).join(" \n");

			return message;
		}
		catch (err) {
			dbModel.error("ItemModel.formatItemMessage", err.toString());
			throw err;
		}
	}

	/**
     * Return first item found
     * Match via substring
     * @param {string} searchTerm
     */
	getFirstResult(searchTerm) {
		try {
			const lowerSearch = searchTerm.toLowerCase();
			const result = this.items.find(item => {
				const formatted = this.formatName(item.name);
				return formatted.includes(lowerSearch);
			});
			return result;
		}
		catch (err) {
			dbModel.error("ItemModel.getFirstResult", err.toString());
			throw err;
		}
	}

	/**
     * Return first item found
     * Match exact searchTerm
     * @param {string} searchTerm
     */
	getExactMatch(searchTerm) {
		try {
			const lowerSearch = searchTerm.toLowerCase();
			const result = this.items.find(item => {
				const formatted = this.formatName(item.name);
				return formatted === lowerSearch;
			});
			return result;
		}
		catch (err) {
			dbModel.error("ItemModel.getExactMatch", err.toString());
			throw err;
		}
	}

	/**
     * Return all items found
     * Match via substring
     * @param {string} searchTerm
     */
	getAllResults(searchTerm) {
		try {
			const lowerSearch = searchTerm.toLowerCase();
			const result = this.items.filter(item => {
				const formatted = this.formatName(item.name);
				return formatted.includes(lowerSearch);
			});
			return result;
		}
		catch (err) {
			dbModel.error("ItemModel.getAllResults", err.toString());
			throw err;
		}
	}

	/**
     * Attempt to return an exact match of a item's name
     * Otherwise, return the first result that matches via substring
     * @param {string} searchTerm
     */
	search(searchTerm) {
		try {
			// If an exact match is found, return it
			const exactMatch = this.getExactMatch(searchTerm);
			if (exactMatch) {
				return this.formatItemMessage(exactMatch);
			}

			const firstResult = this.getFirstResult(searchTerm);
			if (firstResult) {
				return this.formatItemMessage(firstResult);
			}

			return `No item found for search term: ${searchTerm}!`;
		}
		catch (err) {
			dbModel.error("ItemModel.search", err.toString());
			return "An error occurred";
		}
	}
}

module.exports = ItemModel;