import React from 'react';
import './StickerAllowance.css';
import { RESEARCH_CONFIG } from '../Configs/research-config';

const StickerAllowance = ({ employmentStatus }) => {
  const stickerConfig = RESEARCH_CONFIG.stickerSystem[employmentStatus];
  const interruptConfig = RESEARCH_CONFIG.interruptCards[employmentStatus];

  if (!stickerConfig) return null;

  const stickerCount = stickerConfig.allowance;
  const stickers = Array(stickerCount).fill('•');
  const isUniversity = employmentStatus === 'university';

  return (
    <div className="sticker-allowance">
      <div className="sticker-header">
        <div className="sticker-title">
          <span className="sticker-icon">🎫</span>
          <span>Expert Meeting Capacity</span>
        </div>
        <div className="sticker-count-badge">
          {stickers.map((s, i) => (
            <span key={i} className="sticker-mini">{s}</span>
          ))}
        </div>
      </div>

      <p className="sticker-subtitle">{stickerConfig.reasoning}</p>

      <div className="sticker-display">
        <div className="sticker-visual">
          <div className="sticker-dots-large">
            {stickers.map((s, i) => (
              <div key={i} className="sticker-dot-large">
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="sticker-label">
            <span className="count-number">{stickerCount}</span>
            <span className="count-text">sticker{stickerCount > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="sticker-instructions">
        <div className="instructions-title">How Stickers Work:</div>
        <div className="instruction-item">
          <span className="instruction-number">1</span>
          <span><strong>Collect</strong> your {stickerCount} stickers at the Sticker Station</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-number">2</span>
          <span><strong>Sign up</strong> by placing stickers on the Expert Poster on the wall</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-number">3</span>
          <span><strong>Visit</strong> the expert when your slot comes up</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-number">🏃</span>
          <span><strong>First come, first served</strong> - slots fill up fast!</span>
        </div>
      </div>

      {/* Interrupt reminder for university employees */}
      {isUniversity && interruptConfig && interruptConfig.cardsPerRound > 0 && (
        <div className="interrupt-reminder">
          <div className="interrupt-reminder-header">
            <span className="interrupt-icon">⚡</span>
            <span>University Obligation</span>
          </div>
          <p className="interrupt-reminder-text">
            Draw an <strong>Interrupt Card</strong> at the sticker station.
            Teaching duties may cost you a sticker!
          </p>
        </div>
      )}

      {/* Legend - only 2 categories */}
      <div className="sticker-legend">
        <div className="legend-title">Activity Costs:</div>
        <div className="legend-items">
          <div className="legend-item intensive">
            <span className="legend-dots">••</span>
            <div className="legend-text">
              <strong>Intensive activities</strong>
              <span>Patents, pilots, negotiations</span>
            </div>
          </div>
          <div className="legend-item standard">
            <span className="legend-dots">•</span>
            <div className="legend-text">
              <strong>Standard meetings</strong>
              <span>TTO, investors, grants, customers</span>
            </div>
          </div>
        </div>
        <div className="legend-note">
          <span className="note-icon">💡</span>
          <span>Internal work (prototyping, hiring) = no sticker needed, hours only</span>
        </div>
      </div>
    </div>
  );
};

export default StickerAllowance;
