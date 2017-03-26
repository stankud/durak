import generateDeck from './generate-deck';
import dealer from './dealer';

export default ({ playerIds }) => {
  const playerCount = playerIds.length;
  if (playerCount > 5 || playerCount < 2) {
    throw new Error(`Invalid number of players: ${playerCount}`);
  }

  let gameState = {
    deck: dealer.shuffle(generateDeck()),
    cardsOffense: [],
    cardsDefense: []
  };

  gameState.players = playerIds.map((id, index) => ({ id, cards: [] }));
  gameState = dealer.deal(gameState);
  gameState = dealer.findLowestTrumpPlayer(gameState);
  return gameState;
};