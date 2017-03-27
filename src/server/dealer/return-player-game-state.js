const returnOpponentCardCounts = (index, players) => {
  const cardCountsArrays = players.reduce((prev, cur, curIndex) => {
    const l = cur.cards.length;
    if (curIndex > index) prev[0].push(l);
    if (curIndex < index) prev[1].push(l);
    return prev;
  }, [[],[]]);
  return [].concat(cardCountsArrays[0], cardCountsArrays[1]);
};

export default (playerId, state) => {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  const player = state.players[playerIndex];
  if (!player) throw new Error('Invalid player id');
  const playerGameState = Object.assign({}, {
    cardsPlayer: player.cards,
    cardsDeckCount: state.deck.length,
    playerLegalMoves: player.legalMoves,
    cardsOffense: state.cardsOffense,
    cardsDefense: state.cardsDefense,
    trump: state.trump,
    cardsOpponentsCounts: returnOpponentCardCounts(playerIndex, state.players)
  });
  return playerGameState;
};
