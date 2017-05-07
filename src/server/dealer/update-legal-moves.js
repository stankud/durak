import clone from '../clone';

// helpers
const areNoLegalMovesSet = (cgs, nps) => !cgs.players[0].legalMoves && !nps;
const isNewRound = (cgs) => cgs.cardsOffense.legnth === 0;
const isAttackStarted = (cgs) => cgs.cardsOffense.legnth > 1;
const isAttackCardLimitReached = (cgs, limit) => cgs.cardsOffense === limit;
const areAllCardsDefended = (cgs) => cgs.cardsOffense === cgs.cardsDefense;
const isLastPlayer = (index, players) => index + 1 === players.length;
const findAttacker = players => players.findIndex(p => p.legalMoves.attack);
const setAttacker = (players, attackerIndex) => players.map((p, i) => {
  if (i === attackerIndex) p.legalMoves = ['attack'];
  else p.legalMoves = [];
  return p;
});
const returnAttackCardLimit = cgs => 6;

/*
  updateInitial,
  newRound,
  attackStarted,
  attackCardLimitReached,
  allCardsDefended
*/

// updaters
const updateInitial = (state) => {
  const newState = clone(state);
  const { lowestTrump, players } = newState;
  const attackerIndex = lowestTrump.player;
  const attackerIsLastPlayer = isLastPlayer(attackerIndex, players);
  const defenderIndex = attackerIsLastPlayer ? 0 : attackerIndex + 1;
  setAttacker(newState.players, attackerIndex);
  return newState;
};
const updateAttackStarted = () => {

};

export default ({ cgs, nps }) => { // curent game state, new player state
  let ret = { result: 'Ok' }; // new game state
  if (areNoLegalMovesSet(cgs, nps)) ret.ngs = updateInitial(cgs);
  const attackCardLimit = returnAttackCardLimit(cgs);
  const newRound = isNewRound(cgs);
  const attackStarted = isAttackStarted(cgs);
  const attackCardLimitReached = isAttackCardLimitReached(cgs, attackCardLimit);
  const allCardsDefended = areAllCardsDefended(cgs);
  
  return ret;
};
