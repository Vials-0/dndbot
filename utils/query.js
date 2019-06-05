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
 * Query a spell using the http://www.dnd5eapi.co/ api
 * @param {string} search - Search term, seperated by hyphens. Example: "magic-missile"
 */
const querySpell = (search) => {
	try {

		// Format serch query for use by API
		// "magic-missile" --> "Magic+Missile"
		const formattedQuery = search
			.split("-")
			.map(item => item.charAt(0).toUpperCase() + item.substr(1))
			.join("+");

		const url = `${baseWikiUrl}/spells/?name=${formattedQuery}`;

		// Query for spell's direct url
		apiGet(url).then(data => {
			if (!data.count) {
				console.log("No spell found!");
			}
			else {
				const spellUrl = data.results[0].url;

				// Query for spell data
				apiGet(spellUrl).then(result => {
					const { desc, range, level, duration, concentration, casting_time } = result;

					console.log({
						level,
						range,
						duration,
						concentration,
						casting_time,
						desc
					});

					return desc;
				});
			}
		});
	}
	catch (err) {
		console.log("querySpell error:", err);
	}
};

module.exports = {
	querySpell
};