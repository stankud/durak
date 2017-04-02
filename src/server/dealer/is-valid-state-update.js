import { diff } from 'deep-diff';
import moves from '../../lib/moves';
import returnPlayerGameState from './return-player-game-state';

const isNoUpdate = diffs => diffs === undefined;
const isTooManyUpdates = diffs => diffs.length > 2;
const returnDiffsKinds = (diffs) => diffs.sort().map(diff => diff.kind).join();
const isTooManyPropUpdates = diffs => !diffs[0].kind !== 'A' || !diffs[1].kind !== 'A';
const returnMoveName = diffs => {
  const diffKinds = returnDiffsKinds(diffs);
  if (diffKinds.match(/(N|E)/) && diffs[0].path.join('.') === 'endAttack') {
    return moves[3];
  }
  if (diffKinds === 'AA') {

  }
};

export default ({ gameState, playerState }) => {
  let validUpdate = false;
  const lhs = returnPlayerGameState(playerState.playerId, gameState);
  const rhs = playerState;
  const diffs = diff(lhs, rhs);
  console.log(diffs);
  if (isNoUpdate(diffs)) return true;
  if (isTooManyUpdates(diffs)) return false;
  const move = returnMoveName(diffs);
  return lhs.playerLegalMoves.indexOf(move) > -1;
};
