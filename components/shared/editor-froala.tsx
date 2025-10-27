"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { staffService } from "@/services/staff.service";

// Import Froala CSS and plugins
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

// Import Froala plugins CSS
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/plugins/draggable.min.css";
import "froala-editor/css/plugins/colors.min.css";
import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/line_breaker.min.css";
import "froala-editor/css/plugins/table.min.css";
import "froala-editor/css/plugins/fullscreen.min.css";

// Dynamically import FroalaEditor to prevent SSR issues
const FroalaEditor = dynamic(
  () => {
    return import("react-froala-wysiwyg").then((mod) => {
      // Import Froala plugins
      if (typeof window !== "undefined") {
        require("froala-editor/js/plugins.pkgd.min.js");

        // Import specific plugins
        require("froala-editor/js/plugins/align.min.js");
        require("froala-editor/js/plugins/code_beautifier.min.js");
        require("froala-editor/js/plugins/code_view.min.js");
        require("froala-editor/js/plugins/colors.min.js");
        require("froala-editor/js/plugins/draggable.min.js");
        require("froala-editor/js/plugins/entities.min.js");
        require("froala-editor/js/plugins/font_family.min.js");
        require("froala-editor/js/plugins/font_size.min.js");
        require("froala-editor/js/plugins/fullscreen.min.js");
        require("froala-editor/js/plugins/image.min.js");
        require("froala-editor/js/plugins/inline_style.min.js");
        require("froala-editor/js/plugins/line_breaker.min.js");
        require("froala-editor/js/plugins/link.min.js");
        require("froala-editor/js/plugins/lists.min.js");
        require("froala-editor/js/plugins/paragraph_format.min.js");
        require("froala-editor/js/plugins/paragraph_style.min.js");
        require("froala-editor/js/plugins/quick_insert.min.js");
        require("froala-editor/js/plugins/quote.min.js");
        require("froala-editor/js/plugins/save.min.js");
        require("froala-editor/js/plugins/table.min.js");
        require("froala-editor/js/plugins/url.min.js");
        require("froala-editor/js/plugins/word_paste.min.js");

        // Import languages
        require("froala-editor/js/languages/ar.js");
      }

      return mod.default;
    });
  },
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[300px] border rounded-md p-4 text-sm text-muted-foreground flex items-center justify-center">
        Loading rich text editor...
      </div>
    ),
  }
);

interface EditorFroalaProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  language?: "en" | "ar";
  direction?: "ltr" | "rtl";
  disabled?: boolean;
  config?: any;
}

function EditorFroala({
  value,
  onChange,
  placeholder,
  language = "en",
  disabled = false,
  config = {},
}: EditorFroalaProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[300px] border rounded-md p-4 text-sm text-muted-foreground flex items-center justify-center">
        Loading rich text editor...
      </div>
    );
  }

  const defaultConfig = {
    // Basic configuration
    placeholderText:
      placeholder ||
      (language === "ar"
        ? "أدخل المحتوى هنا..."
        : "Enter your content here..."),
    language: language,
    direction: language === "ar" ? "rtl" : "ltr",

    // Editor dimensions and behavior
    heightMin: 150,
    heightMax: 500,
    width: "100%",

    // Editor state
    editorClass: disabled ? "fr-disabled" : "",
    readOnly: disabled,

    // Character counter
    charCounterCount: false,

    // Enable essential features (removed video, emoticons, file upload, charCounter, and imageManager)
    pluginsEnabled: [
      "align",
      "codeBeautifier",
      "codeView",
      "colors",
      "draggable",
      "entities",
      "fontFamily",
      "fontSize",
      "fullscreen",
      "image",
      "inlineStyle",
      "lineBreaker",
      "link",
      "lists",
      "paragraphFormat",
      "paragraphStyle",
      "quickInsert",
      "quote",
      "save",
      "table",
      "url",
      "wordPaste",
    ],

    // Comprehensive toolbar (hidden when disabled)
    toolbarButtons: disabled
      ? {}
      : {
          moreText: {
            buttons: [
              "bold",
              "italic",
              "underline",
              "strikeThrough",
              "subscript",
              "superscript",
              "fontFamily",
              "fontSize",
              "textColor",
              "backgroundColor",
              "inlineClass",
              "inlineStyle",
              "clearFormatting",
            ],
          },
          moreParagraph: {
            buttons: [
              "alignLeft",
              "alignCenter",
              "alignRight",
              "alignJustify",
              "formatOLSimple",
              "formatOL",
              "formatUL",
              "outdent",
              "indent",
              "paragraphFormat",
              "paragraphStyle",
              "lineHeight",
              "quote",
            ],
          },
          moreRich: {
            buttons: [
              "insertLink",
              "insertImage",
              "insertTable",
              "specialCharacters",
              "insertHR",
            ],
          },
          moreMisc: {
            buttons: [
              "undo",
              "redo",
              "fullscreen",
              "print",
              "spellChecker",
              "selectAll",
              "html",
              "codeView",
              "save",
              "help",
            ],
            align: "right",
            buttonsVisible: 3,
          },
        },

    // Hide toolbar when disabled
    toolbarInline: disabled ? false : undefined,
    toolbarSticky: disabled ? false : undefined,

    // Font options
    fontFamily: {
      "Arial,Helvetica,sans-serif": "Arial",
      "Georgia,serif": "Georgia",
      "Impact,Charcoal,sans-serif": "Impact",
      "Tahoma,Geneva,sans-serif": "Tahoma",
      "Times New Roman,Times,serif": "Times New Roman",
      "Verdana,Geneva,sans-serif": "Verdana",
      "Cairo,sans-serif": "Cairo (Arabic)",
      "Amiri,serif": "Amiri (Arabic)",
      "Noto Sans Arabic,sans-serif": "Noto Sans Arabic",
    },

    fontSize: [
      "8",
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "18",
      "24",
      "30",
      "36",
      "48",
      "60",
      "72",
      "96",
    ],

    // Image configuration (disabled when editor is disabled)
    imageUpload: disabled ? false : true,
    imageUploadParam: "picture", // Backend expects 'picture' key
    imageUploadMethod: "POST",
    imageMaxSize: 10 * 1024 * 1024, // 10MB
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif", "webp"],
    imageInsertButtons: disabled
      ? []
      : ["imageBack", "|", "imageUpload", "imageByURL"],
    imageEditButtons: disabled
      ? []
      : [
          "imageReplace",
          "imageAlign",
          "imageRemove",
          "|",
          "imageLink",
          "linkOpen",
          "linkEdit",
          "linkRemove",
          "-",
          "imageDisplay",
          "imageStyle",
          "imageAlt",
          "imageSize",
        ],

    // Disable video completely
    videoUpload: false,
    videoInsertButtons: [],

    // Disable file upload
    fileUpload: false,

    // Link options
    linkAlwaysBlank: false,
    linkAutoPrefix: "https://",
    linkEditButtons: ["linkOpen", "linkEdit", "linkRemove"],
    linkInsertButtons: ["linkBack"],

    // Paragraph formats
    paragraphFormat: {
      N: "Normal",
      H1: "Heading 1",
      H2: "Heading 2",
      H3: "Heading 3",
      H4: "Heading 4",
      H5: "Heading 5",
      H6: "Heading 6",
      PRE: "Code",
    },

    // List options
    listAdvancedTypes: true,

    // Table options
    tableEditButtons: [
      "tableHeader",
      "tableRemove",
      "tableRows",
      "tableColumns",
      "tableStyle",
      "tableCells",
      "tableCellBackground",
      "tableCellVerticalAlign",
      "tableCellHorizontalAlign",
    ],
    tableInsertButtons: ["tableBack"],
    tableResizer: true,
    tableResizerOffset: 5,
    tableResizingLimit: 30,

    // Code view
    codeMirror: true,
    codeMirrorOptions: {
      lineNumbers: true,
      mode: "text/html",
      theme: "default",
    },

    // Quick insert (disabled when editor is disabled)
    quickInsertEnabled: disabled ? false : true,
    quickInsertButtons: disabled ? [] : ["image", "table", "ul", "ol", "hr"],

    // Events for editor and custom image upload
    events: {
      initialized: function () {
        console.log("Froala editor initialized");
      },
      contentChanged: function () {
        // Handle content changes if needed
      },
      "image.beforeUpload": function (images: FileList) {
        // Custom upload handler using staffService
        const editor = this as any; // Type assertion for Froala editor instance

        if (images.length > 0) {
          const file = images[0];

          // Upload using staffService
          staffService
            .uploadPicture(file)
            .then((response) => {
              // Insert the uploaded image
              editor.image.insert(response.url, null, null, editor.image.get());
            })
            .catch((error) => {
              console.error("Image upload failed:", error);
              // Show error to user
              alert("Failed to upload image. Please try again.");
            });
        }

        // Return false to prevent default upload
        return false;
      },
      "image.uploaded": function (response: any) {
        console.log("Image uploaded successfully:", response);
      },
      "image.error": function (error: any) {
        console.error("Image upload error:", error);
      },
    },

    // Merge with custom config
    ...config,
  };

  return (
    <FroalaEditor
      model={value || ""}
      onModelChange={onChange}
      config={defaultConfig}
    />
  );
}

export default EditorFroala;
