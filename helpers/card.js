const wrap = require('word-wrap');
const upperFirst = require('lodash.upperfirst');

const formatCard = ({ title, description, stats }) => (
`
\`\`\`
===========================================
${wrap(title, { indent: '| ', width: 40 })}
-------------------------------------------${
!description ? '' :
`
|
${wrap(description, { indent: '| ', width: 40 })}`
}${
!stats ? '' :
`
|
${wrap(stats, { indent: '| ', width: 40 })}`
}
|
===========================================
\`\`\`
`
);

const monsterCard = (monster, showDescription = true) => formatCard({
	title: `${monster.icon}  ${monster.name} > ${monster.givenName}`,
	description: showDescription ? upperFirst(monster.individualDescription) : '',
	stats: monster.stats
});

module.exports = { formatCard, monsterCard };
