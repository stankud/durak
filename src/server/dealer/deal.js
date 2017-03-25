import clone from '../clone';

export default (state) => {
  const newState = clone(state);
  // give out cards to players
  newState.players.forEach((player) => {
    while (player.cards.length < 6) {
      player.cards.push(newState.deck.pop());
    }
  });
  // declate trump card if not yet declared
  if (!newState.trump) {
    newState.deck.unshift(newState.deck.pop());
    newState.trump = newState.deck[0];
  }
  // increment round
  newState.round ? newState.round +=1 : newState.round = 1;
  return newState;
};
