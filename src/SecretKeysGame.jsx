import React, {useEffect, useReducer, useState} from 'react';
import Monogram from './Monogram';
import {gameReducer, newGame, symbols} from './memoryGame';
import './memory-game.css';

export default function SecretKeysGame() {
  const [game, dispatch] = useReducer(gameReducer, undefined, newGame);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (game.flipped.length !== 2) return;
    const timer = setTimeout(() => dispatch({type: 'hide'}), 1100);
    return () => clearTimeout(timer);
  }, [game.flipped]);
  useEffect(() => {
    if (!game.started || game.won) return;
    const timer = setInterval(() => {if (!document.hidden) setSeconds(value => value + 1)}, 1000);
    return () => clearInterval(timer);
  }, [game.started, game.won]);
  const restart = () => {dispatch({type: 'restart', game: newGame()}); setSeconds(0)};
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return <section className="guest-memory guest-section" id="game" tabIndex={-1} aria-labelledby="game-title">
    <div className="memory-shell">
      <p className="guest-kicker">A LITTLE MOMENT OF PLAY</p>
      <h2 id="game-title">The Secret Keys <em>Game.</em></h2>
      <p className="guest-copy" id="game-instructions">Turn over two cards at a time and find all six matching pairs to unlock a little wish for S. Sharon & R. Ramaniya.</p>
      <dl className="memory-stats"><div><dt>Moves</dt><dd>{game.moves}</dd></div><div><dt>Playing time</dt><dd>{time}</dd></div><div><dt>Pairs</dt><dd>{game.matched.length} / {symbols.length}</dd></div></dl>
      <ul className="memory-grid" aria-label="Matching cards" aria-describedby="game-instructions">
        {game.deck.map((card, index) => {
          const matched = game.matched.includes(card.id);
          const faceUp = matched || game.flipped.includes(card.uid);
          return <li key={card.uid}><button type="button" className={`memory-card ${faceUp ? 'is-open' : ''} ${matched ? 'is-matched' : ''}`} aria-label={`Card ${index + 1}: ${faceUp ? card.label + (matched ? ', matched' : '') : 'face down, reveal card'}`} aria-pressed={faceUp} aria-disabled={faceUp || game.flipped.length === 2 || game.won} onClick={() => dispatch({type: 'flip', uid: card.uid})}>
            <span className="memory-card-inner"><span className="memory-card-back" aria-hidden="true"><Monogram variant="light" decorative/><span>REVEAL</span></span><span className="memory-card-front" aria-hidden="true"><img src={card.src} alt="" width="256" height="256" loading="lazy" decoding="async" draggable={false}/><span>{card.label}{matched ? ' ✓' : ''}</span></span></span>
          </button></li>;
        })}
      </ul>
      <p className="memory-status" role="status" aria-live="polite">{game.won ? 'All six pairs found! May love and joy surround S. Sharon & R. Ramaniya as they begin this beautiful chapter.' : game.flipped.length === 2 ? 'Not a match. Try another pair.' : game.matched.length > 0 ? `${game.matched.length} of six pairs found. Keep going!` : 'Choose any two cards to begin.'}</p>
      <button className="guest-button guest-button-dark" type="button" onClick={restart}>Play again <span aria-hidden="true">↻</span></button>
    </div>
  </section>;
}
