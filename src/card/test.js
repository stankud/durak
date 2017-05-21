import test from 'tape';
import Card from '.';

test('Card', (t) => {
  const suit = 'H';
  const rank = 'J';
  const card = new Card({ suit, rank });
  t.is(card.suit, suit, 'has a suit');
  t.is(card.rank, rank, 'has a rank');
  t.end();
});

test('Card.toString()', (t) => {
  const suit = 'H';
  const rank = 'J';
  const card = new Card({ suit, rank });
  t.is(card.toString(), `${rank}${suit}`, 'returns correct string');
  t.end();
});
