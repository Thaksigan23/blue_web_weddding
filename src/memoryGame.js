export const symbols = [
  ['rings', 'Rings'], ['thaali', 'Thaali'], ['lantern', 'Lantern'],
  ['kumbam', 'Kumbam'], ['bell', 'Bell'], ['lotus', 'Lotus'],
].map(([id, label]) => ({id, label, src: `/images/game/icon-${id}.jpg`}));

export function newGame(random = Math.random) {
  const deck = symbols.flatMap(symbol => [0, 1].map(copy => ({...symbol, uid: `${symbol.id}-${copy}`})));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return {deck, flipped: [], matched: [], moves: 0, started: false, won: false};
}

export function gameReducer(state, action) {
  if (action.type === 'restart') return action.game;
  if (action.type === 'hide') return {...state, flipped: []};
  if (action.type !== 'flip' || state.won || state.flipped.length === 2) return state;
  const card = state.deck.find(card => card.uid === action.uid);
  if (!card || state.flipped.includes(card.uid) || state.matched.includes(card.id)) return state;
  const flipped = [...state.flipped, card.uid];
  if (flipped.length === 1) return {...state, flipped, started: true};
  const first = state.deck.find(card => card.uid === flipped[0]);
  if (first.id !== card.id) return {...state, flipped, moves: state.moves + 1};
  const matched = [...state.matched, card.id];
  return {...state, flipped: [], matched, moves: state.moves + 1, won: matched.length === symbols.length};
}
