const rollDice = (number, sides) => {
    try {
        if (!Number.isInteger(number) || !Number.isInteger(sides)) {
            throw "Arguments must be whole numbers!";
        }

        const results = [];
    
        while (number > 0) {
            let roll = Math.floor(Math.random() * sides) + 1;
            results.push(roll);
            number--;
        }

        if (number === 0) {
            return results;
        }
    } catch (err) {
        return err;
    }
}

module.exports = rollDice;