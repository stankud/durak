import { diff } from 'deep-diff';
import returnPlayerGameState from '../return-player-game-state';
import returnMoveName from './return-move-name';
import isValidMove from './is-valid-move';

const isNoUpdate = diffs => diffs === undefined;
const isLegalMove = (m, s) => s.playerLegalMoves.indexOf(m) > -1;

export default ({ gameState, playerState }) => {
  let ret;
  const currentState = returnPlayerGameState(playerState.playerId, gameState);
  const newState = playerState;
  const diffs = diff(currentState, newState);
  if (isNoUpdate(diffs)) return { result: 'NoUpdate' };
  const move = returnMoveName(currentState, newState);
  const legal = isLegalMove(move, currentState);
  if (!legal) {
    ret = { result: 'IllegalMove', move };
  } else if (!isValidMove(move, currentState, newState)) {
    ret = { result: 'InvalidMove', move };
  } else {
    ret = { result: 'Ok', move };
  }
  return ret;
};
