import { diff } from 'deep-diff';
import returnPlayerGameState from './return-player-game-state';

const isNoUpdate = diffs => diffs === undefined;
const isInvalidUpdate = diffs => (diffs.length !== 2 || !diffs[0].kind !== 'A' || !diffs[1].kind !== 'A');

export default ({ gameState, playerState }) => {
  let validUpdate = false;
  const lhs = returnPlayerGameState(playerState.playerId, gameState);
  const rhs = playerState;
  const diffs = diff(lhs, rhs);
  console.log(diffs);
  if (isNoUpdate(diffs)) return true;
  if (isInvalidUpdate(diffs)) return false;
  // if (is)
};
