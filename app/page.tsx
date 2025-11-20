/* eslint-disable react/no-unescaped-entities */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateDailyMessages, type Message } from '@/lib/generator';

function shareUrl(base: string, text: string) {
  const encoded = encodeURIComponent(text);
  return `${base}${encoded}`;
}

function buildShareLinks(text: string) {
  return {
    whatsapp: shareUrl('https://wa.me/?text=', text),
    telegram: shareUrl('https://t.me/share/url?text=', text),
    twitter: shareUrl('https://twitter.com/intent/tweet?text=', text)
  };
}

function todayAtLocal(): Date {
  const now = new Date();
  // Normalize to local date midnight to keep "daily" stable for user's locale
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [count, setCount] = useState<number>(3);

  const date = useMemo(() => todayAtLocal(), []);

  const regenerate = useCallback(
    (n: number) => {
      const list = generateDailyMessages(date, n);
      setMessages(list);
      setCopiedIdx(null);
    },
    [date]
  );

  useEffect(() => {
    regenerate(count);
  }, [regenerate, count]);

  const onCopy = async (idx: number) => {
    const msg = messages[idx]?.text;
    if (!msg) return;
    await navigator.clipboard.writeText(msg);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <main>
      <section className="card" style={{ marginBottom: 14 }}>
        <div className="controls">
          <button className="button primary" onClick={() => regenerate(count)}>
            Generate Today?s Messages
          </button>
          <button className="button" onClick={() => setCount((c) => Math.max(1, Math.min(3, c - 1)))}>
            ?
          </button>
          <span className="muted">Count: {count} (1?3)</span>
          <button className="button" onClick={() => setCount((c) => Math.max(1, Math.min(3, c + 1)))}>
            +
          </button>
          <span className="muted">Local date: {date.toDateString()}</span>
        </div>
        <div className="muted">
          Each message is 10?20 words, English + Hinglish, yogic and modern. Click to copy or share.
        </div>
      </section>

      <section className="message-grid">
        {messages.map((m, i) => {
          const links = buildShareLinks(m.text);
          return (
            <article key={i} className="message">
              <div className="message-text">{m.text}</div>
              <div className="message-footer">
                <span className="pill">{m.category}</span>
                <div className="actions">
                  <button
                    className="button"
                    onClick={() => onCopy(i)}
                    aria-label="Copy message"
                    title="Copy message"
                  >
                    {copiedIdx === i ? 'Copied' : 'Copy'}
                  </button>
                  <a className="button ghost" href={links.whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                  <a className="button ghost" href={links.telegram} target="_blank" rel="noreferrer">
                    Telegram
                  </a>
                  <a className="button ghost" href={links.twitter} target="_blank" rel="noreferrer">
                    X/Twitter
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

