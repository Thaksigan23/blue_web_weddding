import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame, gameReducer, symbols} from './memoryGame.js';
const flip = (state, uid) => gameReducer(state, {type: 'flip', uid});
test('deck contains exactly two of each of the six symbols', () => {
  const {deck} = newGame();
  assert.equal(new Set(deck.map(card => card.uid)).size, 12);
  for (const symbol of symbols) assert.equal(deck.filter(card => card.id === symbol.id).length, 2);
});
test('matching cards use the Tamil wedding illustration set', () => {
  assert.deepEqual(symbols.map(({id}) => id), [
    'thaali', 'kuthu-vilakku', 'kolam', 'malligai', 'kalasam', 'maavilai-thoranam',
  ]);
  for (const {src} of symbols) assert.match(src, /^\/images\/game\/icon-[a-z-]+\.svg$/);
});
test('mismatch locks the board until concealment and duplicate clicks do not count', () => {
  let game = newGame();
  game = flip(game, 'thaali-0');
  assert.equal(flip(game, 'thaali-0'), game);
  game = flip(game, 'kalasam-0');
  assert.equal(game.moves, 1);
  assert.equal(flip(game, 'malligai-0'), game);
  game = gameReducer(game, {type: 'hide'});
  assert.equal(game.flipped.length, 0);
  assert.equal(flip(game, 'thaali-0').flipped.length, 1);
});
test('six matched pairs win once, remain unavailable, and restart resets progress', () => {
  let game = newGame();
  for (const {id} of symbols) {
    game = flip(flip(game, `${id}-0`), `${id}-1`);
    assert.equal(flip(game, `${id}-0`), game);
  }
  assert.equal(game.won, true);
  assert.equal(game.moves, 6);
  assert.equal(game.matched.length, 6);
  const reset = gameReducer(game, {type: 'restart', game: newGame()});
  assert.equal(reset.started, false);
  assert.equal(reset.won, false);
  assert.deepEqual(reset.matched, []);
  assert.equal(reset.moves, 0);
});
