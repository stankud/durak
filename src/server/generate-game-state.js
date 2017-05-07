import generateDeck from './generate-deck';
import dealer from './dealer';

export default ({ playerIds }) => {
  const playerCount = playerIds.length;
  if (playerCount > 5 || playerCount < 2) {
    throw new Error(`Invalid number of players: ${playerCount}`);
  }

  let ngs = { // new game state
    deck: dealer.shuffle(generateDeck()),
    cardsOffense: [],
    cardsDefense: []
  };

  ngs.players = playerIds.map((id, index) => ({ id, cards: [] }));
  ngs = dealer.deal(ngs);
  ngs = dealer.findLowestTrumpPlayer(ngs);
  ngs = dealer.updateLegalMoves({ cgs: ngs }).ngs;
  return ngs;
};