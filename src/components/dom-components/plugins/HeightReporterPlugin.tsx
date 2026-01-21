import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

function HeightReporterPlugin({
  onHeightChange,
}: {
  onHeightChange?: (height: number) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onHeightChange) return;

    const updateHeight = () => {
      editor.getEditorState().read(() => {
        // Measure the full body height to account for any margins/paddings
        const height = document.body.scrollHeight;
        onHeightChange(height);
      });
    };

    const removeUpdateListener = editor.registerUpdateListener(() => {
      // Wait for the DOM update to complete
      requestAnimationFrame(updateHeight);
    });

    // Initial measurement
    requestAnimationFrame(updateHeight);

    // Also observe the element directly for resize events
    let resizeObserver: ResizeObserver | null = null;
    const body = document.body;
    if (body) {
      resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });
      resizeObserver.observe(body);
    }

    return () => {
      removeUpdateListener();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [editor, onHeightChange]);

  return null;
}

export default HeightReporterPlugin;
