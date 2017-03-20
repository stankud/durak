import generateDeck from './generate-deck';
import dealer from './dealer';

export default ({ playerCount }) => {
  let gameState = {
    deck: dealer.shuffle(generateDeck()),
    players: [],
    cardsOffense: [],
    cardsDefense: []
  };
  
  for (let i = 0; i < playerCount; i+=1) {
    gameState.players.push({ cards: [] });
  }
  gameState = dealer.deal(gameState);
  return gameState;
};