import test from 'tape';
import clone from '../src/server/clone';
import generateDeck from '../src/server/generate-deck';
import dealer from '../src/server/dealer';
import generateGameState from '../src/server/generate-game-state';

test('clone()', (t) => {
  const obj = { foo: 'bar', foobar: { baz: 'bar' } };
  const cloneObj = clone(obj);
  t.deepEqual(obj, cloneObj, 'objects equal');
  t.isNot(obj, cloneObj, 'objects are not the same');
  t.end();
});

test('generateDeck()', (t) => {
  const deck = generateDeck();
  t.is(deck.length, 36, '36 cards in deck');
  t.end();
});

test('dealer.shuffle()', (t) => {
  const deck = generateDeck();
  const shuffledDeck = dealer.shuffle(deck);
  console.log(JSON.stringify(shuffledDeck));
  t.is(shuffledDeck.length, 36, 'correct length');
  t.notDeepEqual(deck, shuffledDeck, 'shuffled deck is different');
  t.end();
});

test('dealer.deal()', (t) => {
  const gameState = {
    deck: ['QS','6H','QH','8D','8S','TH','9H','9C','KS','7H','AD','KH','KC','JD','9S','JH','KD','TS','7D','TC','9D','JC','8C','TD','QC','8H','6C','JS','7C','QD','7S','6S','AH','AC','6D','AS'],
    players: [{cards:[]},{cards:[]},{cards:[]},{cards:[]}]
  };
  const actualGameState = dealer.deal(gameState);
  t.is(actualGameState.deck.length, 12, 'correct amount of cards in deck');
  t.ok(actualGameState.trump, 'has a trump card');
  t.is(actualGameState.trump, actualGameState.deck[0], 'trump card is the last card');
  t.is(actualGameState.players[0].cards.length, 6, 'player 1 has 6 cards');
  t.is(actualGameState.players[1].cards.length, 6, 'player 2 has 6 cards');
  t.is(actualGameState.players[2].cards.length, 6, 'player 3 has 6 cards');
  t.is(actualGameState.players[3].cards.length, 6, 'player 4 has 6 cards');
  t.is(actualGameState.round, 1, 'round prop is set to 1');
  t.end();
});

test('dealer.returnHigherRank()', (t) => {
  t.is('AS', dealer.returnHigherRank('AS', 'KH'), 'returns correct card');
  t.is('TH', dealer.returnHigherRank('9S', 'TH'), 'returns correct card');
  t.is('JC', dealer.returnHigherRank('JC', '6C'), 'returns correct card');
  t.is('8H', dealer.returnHigherRank('8H', '7D'), 'returns correct card');
  t.end();
});

test('dealer.findLowestTrumpPlayer()', (t) => {
  const gameState = {
    deck:['8H','8S','QH','TC','AH','JH','8C','QS','9C','QC','7D','6H'],
    players:[
      {cards:['8D','TD','AS','KH','6C','9S']},
      {cards:['AC','7H','6S','JD','JS','TH']},
      {cards:['KC','KD','7S','JC','AD','KS']},
      {cards:['6D','9H','QD','7C','TS','9D']}
    ],
    trump:'8H',
    round:1
  };
  const actualGameState = dealer.findLowestTrumpPlayer(gameState);
  t.ok(actualGameState.lowestTrump, 'lowestTrump prop is set');
  t.ok(actualGameState.lowestTrump.card, 'lowestTrump.card prop is set');
  t.ok(actualGameState.lowestTrump.player >= 0, 'lowestTrump.player prop is set');
  t.is(gameState.trump[1], actualGameState.lowestTrump.card[1], 'lowestTrump.card is trump suit');
  t.ok(
    actualGameState.players[actualGameState.lowestTrump.player].cards.indexOf(actualGameState.lowestTrump.card) >= 0,
    'correct player index'
  );
  t.end();
});

test('dealer.updateLegalMoves() initialUpdate', (t) => {
  const gameState = {
    deck: ['6H', 'JC', 'AH', '6D', '6S', 'TC', 'AD', 'TD', 'KC', '8D', '7C', '8S'],
    players: [
      {cards:['KS','JH','JD','7D','6C','7H']},
      {cards:['KH','9D','TH','9C','QH','8C']},
      {cards:['7S','QC','QD','KD','AC','9S']},
      {cards:['AS','TS','JS','9H','QS','8H']}
    ],
    trump:'6H',
    lowestTrump: {card:'7H',player:0}
  };
  const expected = [
    { attack: true, throwIn: true, endAttack: true },
    { defend: true, pickUp: true },
    { throwIn: true, endAttack: true },
    { throwIn: true, endAttack: true }
  ];
  const actualGameState = dealer.updateLegalMoves(gameState);
  t.ok(actualGameState.players[0].legalMoves, 'player 1 has legalMoves prop');
  t.ok(actualGameState.players[1].legalMoves, 'player 2 has legalMoves prop');
  t.ok(actualGameState.players[2].legalMoves, 'player 3 has legalMoves prop');
  t.ok(actualGameState.players[3].legalMoves, 'player 4 has legalMoves prop');
  t.deepEqual(actualGameState.players[0].legalMoves, expected[0], 'player 1 has correct legalMoves');
  t.deepEqual(actualGameState.players[1].legalMoves, expected[1], 'player 2 has correct legalMoves');
  t.deepEqual(actualGameState.players[2].legalMoves, expected[2], 'player 3 has correct legalMoves');
  t.deepEqual(actualGameState.players[3].legalMoves, expected[3], 'player 4 has correct legalMoves');
  t.end();
});

test('generateGameState()', (t) => {
  const gameState = generateGameState({ playerCount: 4 });
  t.ok(gameState.deck, 'has a deck');
  t.ok(gameState.trump, 'has a trump card');
  t.ok(gameState.cardsOffense, 'has offense cards prop');
  t.ok(gameState.cardsDefense, 'has defense cards prop');
  t.is(gameState.players.length, 4, 'has 4 players');
  t.ok(gameState.lowestTrump, 'has lowest trump');
  t.ok(gameState.lowestTrump.card, 'has lowestTrump.card');
  t.ok(Number.isInteger(gameState.lowestTrump.player), 'has lowestTrump.player');
  t.end();
});
