"use dom";
import "./styles.css";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import ExampleTheme from "./EditorTheme";
import { CssStyle } from "./type";
import HeightReporterPlugin from "./plugins/HeightReporterPlugin";

const viewerConfig = {
  namespace: "news-viewer",
  nodes: [],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
  editable: false,
};

export default function RichTextViewer({
  content,
  onHeightChange,
  style: {
    textColor,
    backgroundColor,
    accentColor,
    textSecondaryColor,
    cardColor,
  } = {},
}: {
  content: string | null;
  onHeightChange?: (height: number) => void;
  style?: CssStyle;
}) {
  const initialConfig = {
    ...viewerConfig,
    editorState: content || undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className="editor-container"
        style={{ width: "100%", height: "auto", margin: 0, padding: 0 }}
      >
        <div
          style={{
            color: textColor,
            height: "auto",
            minHeight: "auto",
            margin: 0,
            padding: 0,
          }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                style={{
                  padding: 0,
                  margin: 0,
                  height: "auto",
                  resize: "none",
                  outline: "none",
                  overflow: "hidden", // Prevent internal scroll
                  lineHeight: "1.5em",
                }}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HeightReporterPlugin onHeightChange={onHeightChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
