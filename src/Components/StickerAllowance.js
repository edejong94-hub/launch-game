import React from 'react';
import './StickerAllowance.css';
import { RESEARCH_CONFIG } from '../Configs/research-config';

const StickerAllowance = ({ employmentStatus }) => {
  const stickerConfig = RESEARCH_CONFIG.stickerSystem[employmentStatus];
  const interruptConfig = RESEARCH_CONFIG.interruptCards[employmentStatus];

  if (!stickerConfig) return null;

  const stickerCount = stickerConfig.allowance;
  const stickers = Array(stickerCount).fill('•');

  return (
    <div className="sticker-allowance">
      <div className="sticker-header">
        <h3>Expert Meeting Capacity</h3>
        <div className="sticker-dots">
          {stickers.map((dot, index) => (
            <span key={index} className="sticker-dot">{dot}</span>
          ))}
        </div>
      </div>

      <div className="sticker-info">
        <p className="sticker-reasoning">{stickerConfig.reasoning}</p>
      </div>

      {interruptConfig && interruptConfig.cardsPerRound > 0 && (
        <div className="interrupt-reminder">
          <div className="interrupt-icon">⚡</div>
          <div className="interrupt-text">
            <strong>{interruptConfig.reminder}</strong>
            <p className="interrupt-effect">{interruptConfig.effect}</p>
          </div>
        </div>
      )}

      <div className="sticker-instructions">
        <h4>How Stickers Work</h4>
        <ol>
          <li><strong>Physical stickers:</strong> You receive {stickerCount} physical sticker{stickerCount !== 1 ? 's' : ''} at the start of each round</li>
          <li><strong>Activities require stickers:</strong> Place stickers on activity cards that require expert meetings</li>
          <li><strong>Track your capacity:</strong> Stickers represent your bandwidth for external expert engagement</li>
        </ol>
      </div>

      <div className="sticker-legend">
        <h4>Activity Costs</h4>
        <div className="legend-items">
          <div className="legend-item heavy">
            <span className="legend-badge">••</span>
            <span className="legend-label">Intensive activities (patents, pilots, negotiations)</span>
          </div>
          <div className="legend-item standard">
            <span className="legend-badge">•</span>
            <span className="legend-label">Standard meetings (TTO, investors, grants)</span>
          </div>
          <div className="legend-item internal">
            <span className="legend-badge">—</span>
            <span className="legend-label">Internal work (prototyping, hiring, agreements)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerAllowance;
