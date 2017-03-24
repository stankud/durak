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
  t.is(shuffledDeck.length, 36, 'correct length');
  t.notDeepEqual(deck, shuffledDeck, 'shuffled deck is different');
  t.end();
});

test('dealer.deal()', (t) => {
  const undealtGameState = {
    deck: generateDeck(),
    players: [{ cards: [] }, { cards: [] }, { cards: [] }, { cards: [] }]
  };
  const dealtGameState = dealer.deal(undealtGameState);
  t.is(dealtGameState.deck.length, 12, 'correct amount of cards in deck');
  t.ok(dealtGameState.trump, 'has a trump card');
  t.is(dealtGameState.trump, dealtGameState.deck[0], 'trump card is the last card');
  t.is(dealtGameState.players[0].cards.length, 6, 'player 1 has 6 cards');
  t.is(dealtGameState.players[1].cards.length, 6, 'player 2 has 6 cards');
  t.is(dealtGameState.players[2].cards.length, 6, 'player 3 has 6 cards');
  t.is(dealtGameState.players[3].cards.length, 6, 'player 4 has 6 cards');
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
  const gameState = dealer.deal({
    deck: dealer.shuffle(generateDeck()),
    players: [{ cards: [] }, { cards: [] }, { cards: [] }, { cards: [] }]
  });
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

test('generateGameState()', (t) => {
  const gameState = generateGameState({ playerCount: 4 });
  t.ok(gameState.deck, 'has a deck');
  t.ok(gameState.trump, 'has a trump card');
  t.ok(gameState.cardsOffense, 'has offense cards prop');
  t.ok(gameState.cardsDefense, 'has defense cards prop');
  t.is(gameState.players.length, 4, 'has 4 players');
  t.ok(gameState.lowestTrump, 'has lowest trump');
  t.ok(gameState.lowestTrump.card, 'has lowestTrump.card');
  t.ok(gameState.lowestTrump.player, 'has lowestTrump.player');
  t.end();
});
