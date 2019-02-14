# durak
Durak game module

### About
[Durak](https://en.wikipedia.org/wiki/Durak) (fool) is a card game that is popular in post-Soviet states. The object of the game is to get rid of all one's cards. At the end of the game, the last player with cards in their hand is the durak.

### Usage ###
```javascript
import Game from 'durak'

const game = new Game({
  id: 'gameId1',
  playerIds: ['pid1', 'pid2']
});

const result = game.makeMove({
  type: 'attack',
  card: '6C'
});

if (!result.ok) {
  // something went wrong
}
```
