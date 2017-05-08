import test from 'tape';
import Deck from '.';
import Card from '../card';

test('Deck', (t) => {
  const deck = new Deck();
  t.is(deck.cards.length, 36, 'has 36 cards');
  t.true(deck.cards[0] instanceof Card, 'cards are instances of Card');
  t.is(typeof deck.shuffle, 'function', 'has a shuggle method');
  t.end();
});

test('Deck_.loadSavedDeck()', (t) => {
  const savedDeck = ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'];
  const deck = new Deck({ savedDeck });
  t.is(deck.cards.length, 12, 'correct card count');
  t.true(deck.cards[0] instanceof Card, 'cards are instances of Card');
  t.is(typeof deck.shuffle, 'function', 'has a shuggle method');
  t.end();
});
