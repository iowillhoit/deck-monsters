/* eslint-disable max-len */

/*
	Eventually this card will become a lower energy card that instead modifies the next card that is played.
	It will make the next roll be a roll that is rolled twice with the best result being used.
	The mechanics are not in place for card chaining yet.
*/

const HitCard = require('./hit');
const { roll, max, nat20 } = require('../helpers/chance');

class LuckyStrike extends HitCard {
	constructor (options) {
		// Set defaults for these values that can be overridden by the options passed in
		const defaultOptions = {
			icon: '🚬'
		};

		super(Object.assign(defaultOptions, options));
	}

	hitCheck (player, target) {
		const attackRoll1 = roll({ primaryDice: this.attackDice, modifier: player.attackModifier, bonusDice: player.bonusAttackDice });
		const attackRoll2 = roll({ primaryDice: this.attackDice, modifier: player.attackModifier, bonusDice: player.bonusAttackDice });

		const betterRoll = (attackRoll2.naturalRoll.result > attackRoll1.naturalRoll.result) ? attackRoll2 : attackRoll1;
		const worseRoll = (attackRoll2.naturalRoll.result < attackRoll1.naturalRoll.result) ? attackRoll2 : attackRoll1;

		this.emit('rolling', {
			reason: `vs AC (${target.ac}) twice to determine if the hit was a success, and uses the best roll.`,
			card: this,
			roll: betterRoll,
			player,
			target
		});

		let commentary = `Natural rolls were ${betterRoll.naturalRoll.result} and ${worseRoll.naturalRoll.result}; used ${betterRoll.naturalRoll.result} as better roll.`;

		const { success, strokeOfLuck, curseOfLoki } = this.isSuccessful(betterRoll, target.ac);

		if (strokeOfLuck) {
			commentary += `${player.givenName} rolled a natural 20. Automatic double max damage.`;
		} else if (curseOfLoki) {
			commentary += `${player.givenName} rolled a 1. Even if ${player.pronouns[0]} would have otherwise hit, ${player.pronouns[0]} misses.`;
		}
		this.emit('rolled', {
			reason: `vs AC (${target.ac})`,
			card: this,
			roll: betterRoll,
			player,
			target,
			outcome: success ? commentary || 'Hit!' : commentary || 'Miss...'
		});

		return {
			attackRoll: betterRoll,
			success,
			strokeOfLuck,
			curseOfLoki
		};
	}
}

LuckyStrike.cardType = 'Lucky Strike';
LuckyStrike.probability = 20;
LuckyStrike.description = 'Roll for attack twice, use the best roll to see if you hit.';
LuckyStrike.cost = 6;
LuckyStrike.level = 2;

module.exports = LuckyStrike;
