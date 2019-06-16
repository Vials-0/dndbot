const spells = require("../data/spells.json");

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

		// Remove parenthesis and anything inside
		// ex. 'Ice Knife (EE)' to 'Ice Knife'
		const formatted = spellName.replace(/ *\([^)]*\) */g, "");

		// Replace spaces with dashes and lowercase
		// ex. 'Ice Knife' to 'ice-knife'
		const lowerDashed = formatted.replace(/\s+/g, "-").toLowerCase();
		return lowerDashed;
	}

	/**
     * Massage data into readable format & add line breaks
     * @param {object} spell
     */
	formatSpellMessage(spell) {
		spell.text = spell.text.join();

		// Set max length of description of a spell to 1500 characters
		// Discord can only send 2000 characters per message
		if (spell.text && (spell.text.length > 1500)) {
			spell.text = spell.text.slice(0, 1500) + "... **(Spell description over character limit)**";
		}

		// Format keys correct and add line breaks
		const message = Object.keys(spell).map(key => {
			let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
			capitalizedKey = capitalizedKey.replace(/_/g, " ");
			return `${capitalizedKey}: ${spell[key]}`;
		}).join(" \n");

		return message;
	}

	/**
     * Return first spell found
     * Match via substring
     * @param {string} searchTerm
     */
	getFirstResult(searchTerm) {
		const lowerSearch = searchTerm.toLowerCase();
		const result = this.spells.find(spell => {
			const formatted = this.formatName(spell.name);
			return formatted.includes(lowerSearch);
		});
		return result;
	}

	/**
     * Return first spell found
     * Match exact searchTerm
     * @param {string} searchTerm
     */
	getExactMatch(searchTerm) {
		const lowerSearch = searchTerm.toLowerCase();
		const result = this.spells.find(spell => {
			const formatted = this.formatName(spell.name);
			return formatted === lowerSearch;
		});
		return result;
	}

	/**
     * Return all spells found
     * Match via substring
     * @param {string} searchTerm
     */
	getAllResults(searchTerm) {
		const lowerSearch = searchTerm.toLowerCase();
		const result = this.spells.filter(spell => {
			const formatted = this.formatName(spell.name);
			return formatted.includes(lowerSearch);
		});
		return result;
	}

	/**
     * Attempt to return an exact match of a spells name
     * Otherwise, return the first result that matches via substring
     * @param {string} searchTerm
     */
	search(searchTerm) {

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
}

module.exports = SpellModel;