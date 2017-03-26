import clone from '../clone';

// helpers
const areNoLegalMovesSet = state => !state.players[0].legalMoves;
const isLastPlayer = (index, players) => index + 1 === players.length;

// updaters
const initialUpdate = (state) => {
  const newState = clone(state);
  const { lowestTrump, players } = newState;
  const attackerIndex = lowestTrump.player;
  const attackerIsLastPlayer = isLastPlayer(attackerIndex, players);
  const defenderIndex = attackerIsLastPlayer ? 0 : attackerIndex + 1;
  newState.players = players.map((p, i) => {
    if (i === attackerIndex) p.legalMoves = ['attack'];
    else p.legalMoves = [];
    return p;
  });
  return newState;
};
const findAttacker = players => players.findIndex(p => p.legalMoves.attack);

export default (state) => {
  let newState;
  if (areNoLegalMovesSet(state)) {
    newState = initialUpdate(state);
  };
  return newState;
};
