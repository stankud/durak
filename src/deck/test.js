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
