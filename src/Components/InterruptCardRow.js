import React, { useState, useEffect, useCallback } from 'react';
import { INTERRUPT_CARDS } from '../Configs/interrupt-cards';
import './InterruptCardRow.css';

const TIME_CARDS  = Object.values(INTERRUPT_CARDS).filter(c => c.category?.startsWith('time_') && c.category !== 'time_money_combo');
const MONEY_CARDS = Object.values(INTERRUPT_CARDS).filter(c => c.category === 'money' || c.category === 'time_money_combo');
const POS_CARDS   = Object.values(INTERRUPT_CARDS).filter(c => c.isPositive);

function InterruptCardRow({ employmentStatus, onImpactChange }) {
  const cardCount = employmentStatus === 'university' ? 2 : 1;
  const [cards, setCards] = useState(Array(cardCount).fill('noCard'));

  const calcImpact = useCallback((cardList) => {
    let hours = 0, money = 0, trl = 0, freeExpert = false;
    cardList.forEach(id => {
      const card = INTERRUPT_CARDS[id];
      if (card?.effect) {
        hours += card.effect.hours || 0;
        money += card.effect.money || 0;
        trl   += card.effect.trl   || 0;
        if (card.effect.freeExpertMeeting) freeExpert = true;
      }
    });
    return { hours, money, trl, freeExpert, cards: cardList };
  }, []);

  useEffect(() => {
    onImpactChange(calcImpact(cards));
  }, [cards, calcImpact, onImpactChange]);

  const handleChange = (index, value) => {
    const next = [...cards];
    next[index] = value;
    setCards(next);
  };

  const impact = calcImpact(cards);

  const parts = [];
  if (impact.hours !== 0) parts.push(`${impact.hours > 0 ? '+' : ''}${impact.hours} hrs`);
  if (impact.money !== 0) parts.push(`${impact.money > 0 ? '+' : '-'}€${Math.abs(impact.money)}`);
  if (impact.trl   > 0)  parts.push(`+${impact.trl} TRL`);
  if (impact.freeExpert) parts.push('free expert');
  const impactText = parts.length > 0 ? parts.join(', ') : 'No impact';

  const hasPositive = cards.some(id => INTERRUPT_CARDS[id]?.isPositive);
  const hasNegative = cards.some(id => {
    const e = INTERRUPT_CARDS[id]?.effect;
    return e && (e.hours < 0 || e.money < 0);
  });

  return (
    <div className={`interrupt-row${hasPositive ? ' positive' : hasNegative ? ' negative' : ''}`}>
      <span className="ir-label">⚡ Interrupts:</span>

      {cards.map((cardId, i) => (
        <select
          key={i}
          value={cardId}
          onChange={e => handleChange(i, e.target.value)}
          className="ir-select"
        >
          <option value="noCard">No card</option>
          <optgroup label="Time Loss">
            {TIME_CARDS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </optgroup>
          <optgroup label="Money Loss">
            {MONEY_CARDS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </optgroup>
          <optgroup label="Positive">
            {POS_CARDS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </optgroup>
        </select>
      ))}

      <span className={`ir-impact${hasPositive ? ' positive' : hasNegative ? ' negative' : ''}`}>
        {impactText}
      </span>
    </div>
  );
}

export default InterruptCardRow;
