import clone from '../clone';
import dealer from '../dealer';

export default (state) => {
  const newState = clone(state);
  const { players, trump: [trumpRank, trumpSuit] } = newState;
  const lt = {}; // lowestTrump
  const setLowestTrump = (card, index) => {
    if (card[1] === trumpSuit) {
      if (!lt.card || (lt.card === dealer.returnHigherRank(lt.card, card))) {
        lt.card = card;
        lt.player = index;
      }
    }
  };
  players.forEach((p, i) => p.cards.forEach(c => setLowestTrump(c, i)));
  newState.lowestTrump = lt;
  return newState;
};
