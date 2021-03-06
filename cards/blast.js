/* eslint-disable max-len */

const BaseCard = require('./base');
const { CLERIC } = require('../helpers/classes');

class BlastCard extends BaseCard {
	// Set defaults for these values that can be overridden by the options passed in
	constructor ({
		damage,
		icon = '💥',
		levelDamage
	} = {}) {
		super({ damage, icon, levelDamage });
	}

	get damage () {
		return this.options.damage;
	}

	get levelDamage () {
		return this.options.levelDamage;
	}

	get stats () {
		return `Blast: ${this.damage} base damage +${this.levelDamage} per level of the caster`;
	}

	effect (player, target, ring, activeContestants) {
		const damage = this.damage + (this.levelDamage * player.level);

		return new Promise((resolve) => {
			resolve(Promise.all(activeContestants.map(({ monster }) => {
				if (monster !== player) {
					return monster.hit(damage, player, this);
				}

				return Promise.resolve();
			}))
				.then(() => !target.dead));
		});
	}
}

BlastCard.cardType = 'Blast';
BlastCard.probability = 30;
BlastCard.description = 'A magical blast against every opponent in the encounter.';
BlastCard.cost = 4;
BlastCard.level = 0;
BlastCard.permittedClasses = [CLERIC];
BlastCard.defaults = {
	damage: 3,
	levelDamage: 1
};

BlastCard.flavors = {
	hits: [
		['blasts', 80],
		['sends a magical blast hurtling into', 70],
		['invokes an ancient spell against', 70],
		['incinerates', 50],
		['farts in the general direction of', 5]
	]
};

module.exports = BlastCard;
