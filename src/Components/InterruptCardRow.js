import React, { useState, useEffect, useCallback } from 'react';
import { INTERRUPT_CARDS, INTERRUPT_CARD_GROUPS } from '../Configs/interrupt-cards';
import './InterruptCardRow.css';

// Build a lookup map for fast access
const CARD_MAP = Object.fromEntries(INTERRUPT_CARDS.map(c => [c.id, c]));

function InterruptCardRow({ employmentStatus, onImpactChange }) {
  const cardCount = employmentStatus === 'university' ? 2 : 1;
  const [selected, setSelected] = useState(Array(cardCount).fill(''));

  const calcImpact = useCallback((cardIds) => {
    let hours = 0, money = 0, trl = 0, freeExpert = false;
    const cards = [];
    cardIds.forEach(id => {
      const card = CARD_MAP[id];
      if (card) {
        hours += card.hours || 0;
        money += card.money || 0;
        trl   += card.trl   || 0;
        if (card.freeExpert) freeExpert = true;
        cards.push(card);
      }
    });
    return { hours, money, trl, freeExpert, cards };
  }, []);

  useEffect(() => {
    onImpactChange(calcImpact(selected));
  }, [selected, calcImpact, onImpactChange]);

  const handleChange = (index, value) => {
    setSelected(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const impact = calcImpact(selected);
  const hasPositive = impact.hours > 0 || impact.money > 0 || impact.trl > 0 || impact.freeExpert;
  const hasNegative = impact.hours < 0 || impact.money < 0;

  const parts = [];
  if (impact.hours !== 0) parts.push(`${impact.hours > 0 ? '+' : ''}${impact.hours} hrs`);
  if (impact.money !== 0) parts.push(`${impact.money > 0 ? '+' : ''}€${impact.money.toLocaleString()}`);
  if (impact.trl   >  0) parts.push(`+${impact.trl} TRL`);
  if (impact.freeExpert) parts.push('free expert');
  const impactText = parts.length > 0 ? parts.join(', ') : 'No impact';

  return (
    <div className={`interrupt-row${hasPositive ? ' positive' : hasNegative ? ' negative' : ''}`}>
      <span className="ir-label">⚡ Interrupts ({cardCount}):</span>

      {selected.map((val, i) => (
        <div key={i} className="ir-slot">
          <label className="ir-slot-label">Card {i + 1}</label>
          <select
            value={val}
            onChange={e => handleChange(i, e.target.value)}
            className="ir-select"
          >
            <option value="">-- Select card # --</option>
            {INTERRUPT_CARD_GROUPS.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.ids.map(id => {
                  const card = CARD_MAP[id];
                  return (
                    <option key={id} value={id}>
                      #{id} – {card.name}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </div>
      ))}

      <span className={`ir-impact${hasPositive ? ' positive' : hasNegative ? ' negative' : ''}`}>
        {impactText}
      </span>
    </div>
  );
}

export default InterruptCardRow;
