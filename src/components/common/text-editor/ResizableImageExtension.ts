import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "@/components/common/text-editor/ResizableImageComponent";

export const ResizableImage = Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        renderHTML: (attributes) => ({
          width: attributes.width,
          style: `width: ${attributes.width}`,
        }),
      },
      alignment: {
        default: "center",
        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});