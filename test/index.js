import test from 'tape';
import clone from '../src/server/clone';
import generateDeck from '../src/server/generate-deck';
import dealer from '../src/server/dealer';

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

test.skip('dealer.shuffle()', (t) => {
  const deck = setupDeck();
  const shuffledCards = deck.shuffle(deck.cards);
  console.log(deck.cards)
  t.notDeepEqual(deck.cards, shuffledCards, 'not equal');
  t.end();
});

