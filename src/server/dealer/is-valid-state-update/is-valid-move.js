import diff from 'lodash.difference';
import canBeatCard from '../can-beat-card';

const isValidThrowIn = (c, n) => {
  const [[newRank]] = diff(n.cardsOffense, c.cardsOffense);
  const validRanks = c.cardsOffense.map(c => c[0]);
  return validRanks.indexOf(newRank) > -1;
};
const isValidDefend = (c, n) => {
  const { trump, cardsDefense, cardsOffense } = c;
  const [cardDefense] = diff(n.cardsDefense, cardsDefense);
  const cardDefenseIdx = n.cardsDefense.indexOf(cardDefense);
  const cardOffense = cardsOffense[cardDefenseIdx];
  return canBeatCard({ cardOffense, cardDefense, trump });
};

export default (m, c, n) => { // move, current state, new state
  if (m === 'end-attack' || m === 'pick-up' || m === 'attack') return true;
  if (m === 'throw-in') return isValidThrowIn(c, n);
  if (m === 'defend') return isValidDefend(c, n);
  return null;
};
