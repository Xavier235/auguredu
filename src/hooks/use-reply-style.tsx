import { useEffect, useState } from "react";
import { REPLY_STYLES, REPLY_STYLE_STORAGE, type ReplyStyle } from "@/lib/reply-style";

export function useReplyStyle() {
  const [style, setStyleState] = useState<ReplyStyle>("balanced");
  useEffect(() => {
    const v = window.localStorage.getItem(REPLY_STYLE_STORAGE);
    if (v && v in REPLY_STYLES) setStyleState(v as ReplyStyle);
  }, []);
  function setStyle(s: ReplyStyle) {
    setStyleState(s);
    window.localStorage.setItem(REPLY_STYLE_STORAGE, s);
  }
  return [style, setStyle] as const;
}

export function ReplyStylePicker({ value, onChange }: { value: ReplyStyle; onChange: (s: ReplyStyle) => void }) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
      How Augur replies
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReplyStyle)}
        className="rounded-full border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:border-primary"
      >
        {(Object.keys(REPLY_STYLES) as ReplyStyle[]).map((k) => (
          <option key={k} value={k}>
            {REPLY_STYLES[k].label}
          </option>
        ))}
      </select>
    </label>
  );
}
