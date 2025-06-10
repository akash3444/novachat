import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ClassAttributes, ComponentProps, HTMLAttributes } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import ShikiHighlighter, { isInlineCode } from "react-shiki";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./copy-button";

const CodeHighlight = ({
  className,
  children,
  node,
  ...props
}: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps) => {
  const { resolvedTheme } = useTheme();
  const code = String(children).trim();
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;
  const isInline = node ? isInlineCode(node) : undefined;
  const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";

  return !isInline ? (
    <div className="isolate overflow-clip">
      {/* Code block header */}
      <div className="z-10 sticky top-0 h-8 border-b flex items-center justify-between pl-6 pr-2 bg-muted">
        <span className="text-xs text-muted-foreground">{language}</span>
        <CopyButton text={code} />
      </div>

      {/* Code block */}
      <ShikiHighlighter
        language={language}
        theme={theme}
        showLanguage={false}
        {...props}
      >
        {code}
      </ShikiHighlighter>
    </div>
  ) : (
    <code
      className="bg-muted before:content-[''] after:content-[''] py-0.5 px-1 rounded border border-border/70"
      {...props}
    >
      {children}
    </code>
  );
};

export const Markdown = ({
  remarkPlugins,
  components,
  ...props
}: ComponentProps<typeof ReactMarkdown>) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}
      components={{
        code: CodeHighlight,
        pre: ({ className, ...props }) => (
          // This is a hack to make the code block header sticky
          <pre className={cn("overflow-visible", className)} {...props} />
        ),
        ...components,
      }}
      {...props}
    />
  );
};
