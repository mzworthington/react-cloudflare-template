import { useEffect, useId, useRef, useState } from 'react';

type CopyableSnippetProps = {
  code: string;
  'data-testid'?: string;
  label?: string;
};

export function CopyableSnippet({ code, label = 'Copy command', ...rest }: CopyableSnippetProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusId = useId();

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (insecure context / permissions).
    }
  };

  return (
    <div className="hero-snippet-block" {...rest}>
      <pre>
        <code>{code}</code>
      </pre>
      <button
        type="button"
        className="hero-snippet-copy"
        onClick={copy}
        aria-label={copied ? 'Copied' : label}
        aria-describedby={statusId}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span id={statusId} className="sr-only" aria-live="polite">
        {copied ? 'Command copied to clipboard' : ''}
      </span>
    </div>
  );
}
