import generateDeck from './generate-deck';
import dealer from './dealer';

export default ({ playerCount }) => {
  const gameState = {};
  gameState.deck = dealer.shuffle(generateDeck());
  gameState.players = [];
  
  for (let i = 0; i < playerCount; i+=1) {
    gameState.players.push({ cards: [] });
  }
  return dealer.deal(gameState);
};