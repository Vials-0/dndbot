const superagent = require("superagent");
const { baseWikiUrl } = require("../config.json");

// ASYNC - Make a GET call
const apiGet = (url) => {
	return new Promise(resolve => {
		superagent
			.get(url)
			.end((err, res) => {
				const data = res.body;
				resolve(data);
			});
	});
};

/**
 * Return API category corresponding to input command
 * @param {string} command -- input command (ex: "spell" or "creature")
 */
const getCategory = (command) => {
	switch (command) {
	case "spell":
		return "spells";
	case "creature":
		return "monsters";
	case "skill":
		return "skills";
	case "condition":
		return "conditions";
	default:
		console.log("No category found for command ", command);
		return "";
	}
};

/**
 * Format response object into useful data based on command
 * @param {string} command -- bot command
 * @param {object} response -- response from DnD api
 */
const formatReturnData = (response, command) => {
	switch (command) {
	case "spell": {
		const { desc, range, level, duration, concentration, casting_time } = response;
		return {
			level,
			range,
			duration,
			concentration,
			casting_time,
			desc
		};
	}
	case "creature": {
		const { size, type, armor_class, hit_points, speed, special_abilities, actions } = response;
		return {
			size,
			type,
			armor_class,
			hit_points,
			speed,
			actions,
			special_abilities
		};
	}
	case "skill": {
		const { name, desc, ability_score } = response;
		return {
			name,
			abilityScore: ability_score.name,
			desc
		};
	}
	case "condition": {
		const { name, desc } = response;
		return {
			name,
			desc // need to format array
		};
	}
	default:
		console.log(response);
		console.log("No data able to be formatted for command ", command);
		return {};
	}
};

/**
 * Make a query using the http://www.dnd5eapi.co/ api
 * @param {string} search -- search term (ex: "magic-missile" or "dire-wolf")
 * @param {string} command -- bot command (ex: "spell" or "creature")
 */
const queryDndApi = (search, command) => {
	try {
		// Format serch query for use by API
		// "magic-missile" --> "Magic+Missile"
		const formattedQuery = search
			.split("-")
			.map(item => item.charAt(0).toUpperCase() + item.substr(1))
			.join("+");

		const url = `${baseWikiUrl}/${getCategory(command)}/?name=${formattedQuery}`;

		// Query for direct URL
		apiGet(url).then(data => {
			if (!data.count) {
				console.log(`No ${command} found`);
			}
			else {
				const directUrl = data.results[0].url;

				// Query for data
				apiGet(directUrl).then(result => {
					const formattedData = formatReturnData(result, command);
					console.log(formattedData);
					return formattedData;
				});
			}
		});

	}
	catch (err) {
		console.log(`Error querying for ${command} with query: ${search}`);
	}
};

queryDndApi(process.argv[2], process.argv[3]);

module.exports = {
	queryDndApi
};