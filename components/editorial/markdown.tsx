import React from 'react';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
const wiki: Record<string, string> = {
  'Token Buybacks and Emissions': '/article/value-capture',
  'Value Capture': '/article/value-capture',
  'Policy and Regulation': '/article/clarity',
  'Finality — Optimistic vs Deterministic': '/article/finality',
  'Network Reliability and Concentration': '/article/decentralization',
  'Institutional Rails and RWAs': '/institutions',
  'Payments on Solana': '/payments',
  'Solana — Start Here': '/solana',
};
function inline(s: string): React.ReactNode[] {
  return s
    .split(
      /(\[\[[^\]]+\]\]|\[[^\]]+\]\(https:\/\/[^\s)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g,
    )
    .map((p, i) => {
      if (p.startsWith('[[')) {
        const title = p.slice(2, -2).split('|')[0];
        return wiki[title] ? (
          <a key={i} href={wiki[title]}>
            {title}
          </a>
        ) : (
          <span key={i}>{title}</span>
        );
      }
      const link = p.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
      if (link)
        return (
          <a key={i} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]} ↗
          </a>
        );
      if (p.startsWith('**') && p.endsWith('**'))
        return <strong key={i}>{p.slice(2, -2)}</strong>;
      if (p.startsWith('`') && p.endsWith('`'))
        return <code key={i}>{p.slice(1, -1)}</code>;
      return p;
    });
}
export function Markdown({ text }: { text: string }) {
  const chunks = text.split(/\n\s*\n/);
  return (
    <div className="prose">
      {chunks.map((chunk, i) => {
        const lines = chunk.split('\n');
        if (lines[0].startsWith('|') && lines[1]?.includes('---')) {
          const cells = (l: string) =>
            l
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim());
          return (
            <div className="table-wrap" key={i}>
              <Table>
                <TableHeader>
                  <TableRow>
                    {cells(lines[0]).map((c, j) => (
                      <TableHead key={j}>{inline(c)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.slice(2).map((r, j) => (
                    <TableRow key={j}>
                      {cells(r).map((c, k) => (
                        <TableCell key={k} data-label={cells(lines[0])[k]}>
                          {inline(c)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }
        if (/^###? /.test(chunk)) {
          const [title, ...rest] = lines;
          return (
            <section key={i}>
              <h2>{title.replace(/^#+ /, '')}</h2>
              {rest.length > 0 && <p>{inline(rest.join(' '))}</p>}
            </section>
          );
        }
        if (lines.every((l) => l.startsWith('- ')))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(chunk)}</p>;
      })}
    </div>
  );
}
