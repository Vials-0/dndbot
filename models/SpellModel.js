const spells = require("../data/spells.json");
const cloneDeep = require("lodash.clonedeep");
const DatabaseModel = require("./database/DatabaseModel");
const dbModel = new DatabaseModel();


/**
 * Interface with spell JSON - Spell JSON contains more data
 * than the DnD API used by './utils/query'
 */
class SpellModel {
	constructor() {
		if (!SpellModel.instance) {
			SpellModel.instance = this;
		}

		this.spells = spells.compendium.spell;

		return SpellModel.instance;
	}

	/**
     * Format spell names for easy searching
     * @param {string} spellName
     */
	formatName(spellName) {
		try {
			// Remove parenthesis and anything inside
			// ex. 'Ice Knife (EE)' to 'Ice Knife'
			const formatted = spellName.replace(/ *\([^)]*\) */g, "");

			// Replace spaces with dashes and lowercase
			// ex. 'Ice Knife' to 'ice-knife'
			const lowerDashed = formatted.replace(/\s+/g, "-").toLowerCase();
			return lowerDashed;
		}
		catch (err) {
			dbModel.error("SpellModel.formatName", err.toString());
			throw err;
		}
	}

	/**
     * Massage data into readable format & add line breaks
     * @param {object} spell
     */
	formatSpellMessage(spell) {
		try {
			// Clone spell object to prevent mutation
			const spellCopy = cloneDeep(spell);

			if (Array.isArray(spellCopy.text)) {
				spellCopy.text = spellCopy.text.join();
			}

			// Set max length of description of a spell to 1500 characters
			// Discord can only send 2000 characters per message
			// TODO: Implement better handling for long spell text
			if (spellCopy.text && (spellCopy.text.length > 1500)) {
				spellCopy.text = spellCopy.text.slice(0, 1500) + "... \n **(Spell description over character limit)**";
			}

			// Format keys correct and add line breaks
			const message = Object.keys(spellCopy).map(key => {
				let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
				capitalizedKey = capitalizedKey.replace(/_/g, " ");
				return `${capitalizedKey}: ${spellCopy[key]}`;
			}).join(" \n");

			return message;
		}
		catch (err) {
			dbModel.error("SpellModel.formatSpellMessage", err.toString());
			throw err;
		}
	}

	/**
     * Return first spell found
     * Match via substring
     * @param {string} searchTerm
     */
	getFirstResult(searchTerm) {
		try {
			const lowerSearch = searchTerm.toLowerCase();
			const result = this.spells.find(spell => {
				const formatted = this.formatName(spell.name);
				return formatted.includes(lowerSearch);
			});
			return result;
		}
		catch (err) {
			dbModel.error("SpellModel.getFirstResult", err.toString());
			throw err;
		}
	}

	/**
     * Return first spell found
     * Match exact searchTerm
     * @param {string} searchTerm
     */
	getExactMatch(searchTerm) {
		try {
			const lowerSearch = searchTerm.toLowerCase();
			const result = this.spells.find(spell => {
				const formatted = this.formatName(spell.name);
				return formatted === lowerSearch;
			});
			return result;
		}
		catch (err) {
			dbModel.error("SpellModel.getExactMatch", err.toString());
			throw err;
		}
	}

	/**
     * Return all spells found
     * Match via substring
     * @param {string} searchTerm
     */
	getAllResults(searchTerm) {
		try {
			const lowerSearch = searchTerm.toLowerCase();
			const result = this.spells.filter(spell => {
				const formatted = this.formatName(spell.name);
				return formatted.includes(lowerSearch);
			});
			return result;
		}
		catch (err) {
			dbModel.error("SpellModel.getAllResults", err.toString());
			throw err;
		}
	}

	/**
     * Attempt to return an exact match of a spells name
     * Otherwise, return the first result that matches via substring
     * @param {string} searchTerm
     */
	search(searchTerm) {
		try {
			// If an exact match is found, return it
			const exactMatch = this.getExactMatch(searchTerm);
			if (exactMatch) {
				return this.formatSpellMessage(exactMatch);
			}

			const firstResult = this.getFirstResult(searchTerm);

			if (firstResult) {
				return this.formatSpellMessage(firstResult);
			}

			return `No spell found for search term: ${searchTerm}!`;
		}
		catch (err) {
			dbModel.error("SpellModel.search", err.toString());
			return "An error occurred";
		}
	}
}

module.exports = SpellModel;