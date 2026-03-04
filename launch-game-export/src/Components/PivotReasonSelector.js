import React, { useState } from 'react';
import './PivotReasonSelector.css';

const PIVOT_REASONS = [
  {
    id: 'noMarket',
    label: '🚫 No Market Demand',
    description: 'Customers don\'t want what we\'re building',
    lesson: 'Better to learn this now than after launch!',
  },
  {
    id: 'wrongCustomer',
    label: '🎯 Wrong Customer Segment',
    description: 'Our target customer isn\'t the right fit',
    lesson: 'Finding the right customer is half the battle.',
  },
  {
    id: 'competitorBetter',
    label: '🏃 Competitor Does It Better',
    description: 'Existing solutions already solve this well',
    lesson: 'Differentiation is key. Find your unique angle.',
  },
  {
    id: 'techLimitation',
    label: '🔬 Technical Limitations',
    description: 'Our technology can\'t deliver what customers need',
    lesson: 'Sometimes the tech leads you somewhere unexpected.',
  },
  {
    id: 'betterOpportunity',
    label: '💡 Discovered Better Opportunity',
    description: 'Customer interviews revealed a bigger problem',
    lesson: 'The best pivots come from customer insights!',
  },
  {
    id: 'regulatoryIssue',
    label: '⚖️ Regulatory Barriers',
    description: 'Legal/regulatory issues block our original path',
    lesson: 'Always check the regulatory landscape early.',
  },
  {
    id: 'unitEconomics',
    label: '📊 Bad Unit Economics',
    description: 'Can\'t make money at this price point',
    lesson: 'If the math doesn\'t work, the business doesn\'t work.',
  },
];

const PivotReasonSelector = ({
  onConfirm,
  onCancel,
  currentTRL,
  validationCount,
}) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [customNote, setCustomNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selectedReason) return;

    onConfirm({
      reason: selectedReason,
      reasonLabel: PIVOT_REASONS.find(r => r.id === selectedReason)?.label,
      customNote: customNote.trim(),
      previousTRL: currentTRL,
      lostValidations: validationCount,
    });
  };

  const selectedReasonData = PIVOT_REASONS.find(r => r.id === selectedReason);

  return (
    <div className="pivot-overlay">
      <div className="pivot-modal">
        <div className="pivot-header">
          <span className="pivot-icon">🔄</span>
          <h2>Pivot Your Business</h2>
        </div>

        <div className="pivot-warning">
          <div className="warning-title">⚠️ Pivot Consequences</div>
          <ul className="warning-list">
            <li>
              <span className="warning-icon">📉</span>
              <span>TRL will drop from <strong>{currentTRL}</strong> to <strong>{Math.max(3, currentTRL - 1)}</strong></span>
            </li>
            <li>
              <span className="warning-icon">❌</span>
              <span>You will lose <strong>{validationCount}</strong> customer validation(s)</span>
            </li>
            <li>
              <span className="warning-icon">⏱️</span>
              <span>Costs <strong>250 hours</strong> and <strong>€5,000</strong></span>
            </li>
            <li>
              <span className="warning-icon">✅</span>
              <span>You <strong>keep</strong> your interview count and learnings</span>
            </li>
          </ul>
        </div>

        <div className="pivot-reasons">
          <div className="reasons-title">Why are you pivoting?</div>
          <div className="reasons-grid">
            {PIVOT_REASONS.map(reason => (
              <button
                key={reason.id}
                className={`reason-card ${selectedReason === reason.id ? 'selected' : ''}`}
                onClick={() => setSelectedReason(reason.id)}
              >
                <div className="reason-label">{reason.label}</div>
                <div className="reason-description">{reason.description}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedReasonData && (
          <div className="pivot-lesson">
            <span className="lesson-icon">💡</span>
            <span className="lesson-text">{selectedReasonData.lesson}</span>
          </div>
        )}

        <div className="pivot-note">
          <label htmlFor="pivotNote">Add a note (optional):</label>
          <textarea
            id="pivotNote"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="What did you learn? What's your new direction?"
            rows={2}
          />
        </div>

        <div className="pivot-confirm">
          <label className="confirm-checkbox">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span>I understand the consequences and want to pivot</span>
          </label>
        </div>

        <div className="pivot-actions">
          <button
            className="pivot-btn cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="pivot-btn confirm"
            onClick={handleConfirm}
            disabled={!selectedReason || !confirmed}
          >
            🔄 Confirm Pivot
          </button>
        </div>
      </div>
    </div>
  );
};

export default PivotReasonSelector;
