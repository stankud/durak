import shuffle from 'lodash.shuffle';
import suits from '../lib/suits';
import ranks from '../lib/ranks';

export default () => {
  const deck = [];
  suits.forEach(suit => Object.keys(ranks).forEach(rank => deck.push(`${rank}${suit}`)));
  return deck;
};
