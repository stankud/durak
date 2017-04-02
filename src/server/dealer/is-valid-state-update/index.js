import { diff } from 'deep-diff';
import returnPlayerGameState from '../return-player-game-state';
import returnMoveName from './return-move-name';
import isValidMove from './is-valid-move';

const isNoUpdate = diffs => diffs === undefined;
const isLegalMove = (m, s) => s.playerLegalMoves.indexOf(m) > -1;

export default ({ gameState, playerState }) => {
  let validUpdate = false;
  const currentState = returnPlayerGameState(playerState.playerId, gameState);
  const newState = playerState;
  const diffs = diff(currentState, newState);
  if (isNoUpdate(diffs)) return true;
  const move = returnMoveName(currentState, newState);
  console.log('move:');
  console.log(move);
  const legal = isLegalMove(move, currentState);
  const valid = isValidMove(move, currentState, newState);
  return legal && valid;
};
