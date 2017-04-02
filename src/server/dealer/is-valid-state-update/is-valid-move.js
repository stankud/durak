import diff from 'lodash.difference';

const isValidThrowIn = (c, n) => {
  const [[newRank]] = diff(n.cardsOffense, c.cardsOffense);
  const validRanks = c.cardsOffense.map(c => c[0]);
  return validRanks.indexOf(newRank) > -1;
};
const isValidDefend = (c, n) => {
  const [newCard] = diff(n.cardsDefense, c.cardsDefense);
  const validRanks = c.cardsOffense.map(c => c[0]);
  return validRanks.indexOf(newRank) > -1; 
};

export default (m, c, n) => { // move, current state, new state
  if (m === 'end-attack' || m === 'pick-up') return true;
  if (m === 'attack' || m === 'throw-in') return isValidThrowIn(c, n);
  if (m === 'defend') return isValidDefend(c, n);
  return null;
};