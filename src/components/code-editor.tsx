"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
      Đang tải editor...
    </div>
  ),
});

type Props = {
  value: string;
  onChange: (v: string) => void;
  height?: string;
  readOnly?: boolean;
  fontSize?: number;
};

export function CodeEditor({
  value,
  onChange,
  height = "100%",
  readOnly = false,
  fontSize = 14,
}: Props) {
  const [theme, setTheme] = useState<"vs" | "vs-dark">("vs");

  useEffect(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(m.matches ? "vs-dark" : "vs");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "vs-dark" : "vs");
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  return (
    <Monaco
      height={height}
      defaultLanguage="python"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      theme={theme}
      options={{
        fontSize,
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 4,
        insertSpaces: true,
        fontLigatures: true,
        renderWhitespace: "selection",
        smoothScrolling: true,
        padding: { top: 12, bottom: 12 },
      }}
    />
  );
}
