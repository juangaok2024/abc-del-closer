'use client';

import { Step } from '@/content/steps';
import { HighlightBox } from './HighlightBox';

interface StepContentProps {
  step: Step;
}

export function StepContent({ step }: StepContentProps) {
  const { content, quote } = step;

  return (
    <div className="stagger-children">
      {content.type === 'intro' && (
        <p className="text-xl text-[#a0a0a0] leading-relaxed">
          {content.subtext}
        </p>
      )}

      {content.type === 'text' && (
        <div className="space-y-5">
          {content.paragraphs.map((p, i) => (
            <p key={i} className="text-[#d0d0d0] leading-relaxed text-[17px]">
              {p}
            </p>
          ))}
        </div>
      )}

      {content.type === 'earnings' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="gold-text text-xl mt-0.5">•</span>
              <p className="text-[#d0d0d0] text-[17px]">{content.model}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="gold-text text-xl mt-0.5">•</span>
              <p className="text-[#d0d0d0] text-[17px]">{content.example}</p>
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="text-sm text-[#808080] mb-4 uppercase tracking-wider font-medium">Rangos reales</p>
            <div className="space-y-3">
              {content.ranges.map((r, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-[#d0d0d0]">{r.level}</span>
                  <span className="gold-text font-semibold text-lg">{r.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {content.type === 'skills' && (
        <div className="space-y-4">
          {content.skills.map((skill, i) => (
            <div
              key={i}
              className="glass-card p-5 group"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-3">
                <span className="number-badge">{i + 1}</span>
                <span className="gold-text">{skill.title}</span>
              </h3>
              <ul className="space-y-3 ml-1">
                {skill.points.map((point, j) => (
                  <li key={j} className="text-[#b0b0b0] flex items-start gap-3">
                    <span className="text-[#C9A227] mt-1.5 text-xs">●</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {content.type === 'day' && (
        <div className="space-y-8">
          <div className="space-y-1">
            {content.timeline.map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="timeline-dot flex-shrink-0" />
                  {i < content.timeline.length - 1 && (
                    <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b from-[#C9A227]/30 to-transparent mt-2" />
                  )}
                </div>
                <div className="pb-6 pt-0">
                  <p className="gold-text font-semibold text-sm uppercase tracking-wider mb-1">
                    {item.time}
                  </p>
                  <p className="text-[#d0d0d0] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-5">
            <p className="text-sm text-[#808080] mb-4 uppercase tracking-wider font-medium">
              Lo que NO hacés
            </p>
            <ul className="space-y-3">
              {content.notDo.map((item, i) => (
                <li key={i} className="text-[#b0b0b0] flex items-start gap-3">
                  <span className="text-red-400/80 mt-0.5 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {content.type === 'howto' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {content.paths.map((path, i) => (
              <div
                key={i}
                className={`glass-card p-5 border-l-4 ${
                  i === 0
                    ? 'border-l-red-400/60 bg-red-500/5'
                    : 'border-l-emerald-400/60 bg-emerald-500/5'
                }`}
              >
                <p className={`font-semibold mb-2 ${i === 0 ? 'text-red-400/90' : 'text-emerald-400/90'}`}>
                  {path.name}
                </p>
                <p className="text-[#b0b0b0] text-sm leading-relaxed">{path.steps}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-5">
            <p className="text-sm text-[#808080] mb-4 uppercase tracking-wider font-medium">
              Requisitos
            </p>
            <ul className="space-y-3">
              {content.requirements.map((req, i) => (
                <li key={i} className="text-[#b0b0b0] flex items-start gap-3">
                  <span className="text-[#C9A227] mt-0.5">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {content.type === 'cta' && (
        <div className="space-y-5">
          {content.paragraphs.map((p, i) => (
            <p key={i} className="text-[#d0d0d0] leading-relaxed text-lg">
              {p}
            </p>
          ))}
        </div>
      )}

      {quote && (
        <HighlightBox variant="quote">
          <p className="text-[#f0f0f0]/90 italic">{quote}</p>
        </HighlightBox>
      )}
    </div>
  );
}
