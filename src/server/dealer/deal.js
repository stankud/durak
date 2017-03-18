import clone from '../clone';

export default (state) => {
  const newState = clone(state);
  newState.players.forEach((player) => {
    while (player.cards.length < 6) {
      player.cards.push(newState.deck.pop());
    }
  });
  newState.deck.unshift(newState.deck.pop());
  newState.trump = newState.deck[0];
  return newState;
};
