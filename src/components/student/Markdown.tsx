'use client';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Plain text of a Markdown reply, for "Listen" and "Copy": no asterisks read aloud, no list symbols. */
export function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*---+\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const SAFE_LINK = /^(https?:|mailto:|tel:|\/)/i;

const components: Components = {
  p: ({ children }) => <p className="[&:not(:first-child)]:mt-3">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-night">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="text-muted-foreground">{children}</del>,
  h1: ({ children }) => <h3 className="mt-4 font-display text-lg font-semibold first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mt-4 font-display text-lg font-semibold first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-3 font-display text-base font-semibold first:mt-0">{children}</h4>,
  h4: ({ children }) => <h4 className="mt-3 font-display text-base font-semibold first:mt-0">{children}</h4>,
  ul: ({ children }) => <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-primary/60">{children}</ul>,
  ol: ({ children }) => <ol className="mt-3 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-primary">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-3 border-l-4 border-primary/30 bg-lilac/50 py-1 pl-4 pr-3 italic text-night/90">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
  a: ({ href, children }) =>
    href && SAFE_LINK.test(href) ? (
      <a href={href} target={href.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">
        {children}
      </a>
    ) : (
      <span>{children}</span>
    ),
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded-md bg-lilac px-1.5 py-0.5 font-mono text-[0.9em] text-night">{children}</code>
    ),
  pre: ({ children }) => <pre className="mt-3 overflow-x-auto rounded-xl bg-night p-4 text-sm leading-6 text-white [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-white">{children}</pre>,
  table: ({ children }) => (
    <div className="mt-3 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-lilac/60">{children}</thead>,
  th: ({ children }) => <th className="border-b border-border px-3 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-border px-3 py-2 last:border-b-0">{children}</td>,
  img: () => null, // the model has no reason to show images; never load remote ones
};

/** Renders a bot reply. Raw HTML is never rendered (react-markdown skips it), links are limited to safe protocols. */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="break-words text-[16px] leading-7">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
