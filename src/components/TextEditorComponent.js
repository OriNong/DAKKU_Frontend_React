import React, { useState, useEffect, useRef } from "react";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Context,
  ContextWatchdog,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  Italic,
  Link,
  List,
  ListProperties,
  Paragraph,
  RemoveFormat,
  SelectAll,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";

import translations from "ckeditor5/translations/ko.js";
import "ckeditor5/ckeditor5.css";

export default function TextEditor({
  onEditorChange,
  className,
  initialContent,
}) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    console.log(content);
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "insertTable",
        "highlight",
        "blockQuote",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      Highlight,
      HorizontalLine,
      Italic,
      Link,
      List,
      ListProperties,
      Paragraph,
      RemoveFormat,
      SelectAll,
      Strikethrough,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
    ],
    balloonToolbar: [
      "bold",
      "italic",
      "|",
      "link",
      "|",
      "bulletedList",
      "numberedList",
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    initialData: initialContent,
    language: "ko",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: "오늘의 일기를 작성하세요!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    translations: [translations],
  };

  return (
    <div className={`text-editor-wrapper ${className || ""}`}>
      <div className="main-container">
        <div
          className="editor-container editor-container_classic-editor"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <CKEditorContext
                  context={Context}
                  contextWatchdog={ContextWatchdog}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={initialContent}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      if (onEditorChange) {
                        onEditorChange(data);
                      }
                    }}
                  />
                </CKEditorContext>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import {
//   ClassicEditor,
//   Context,
//   Bold,
//   Essentials,
//   Italic,
//   Paragraph,
//   ContextWatchdog,
// } from "ckeditor5";
// import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
// import { useRef, useState, useEffect } from "react";
// import "ckeditor5/ckeditor5.css";
// import translations from "ckeditor5/translations/ko.js";

// import {
//   AccessibilityHelp,
//   Alignment,
//   Autoformat,
//   Autosave,
//   BalloonToolbar,
//   BlockQuote,
//   FindAndReplace,
//   FontBackgroundColor,
//   FontColor,
//   FontFamily,
//   FontSize,
//   Heading,
//   Highlight,
//   HorizontalLine,
//   Link,
//   List,
//   ListProperties,
//   RemoveFormat,
//   SelectAll,
//   Strikethrough,
//   Table,
//   TableCaption,
//   TableCellProperties,
//   TableColumnResize,
//   TableProperties,
//   TableToolbar,
//   TextTransformation,
//   TodoList,
//   Underline,
//   Undo,
// } from "ckeditor5";
// export default function TextEditor({
//   onEditorChange,
//   className,
//   initialContent,
// }) {
//   const editorConfig = {
//     toolbar: {
//       items: [
//         "undo",
//         "redo",
//         "|",
//         "heading",
//         "|",
//         "fontSize",
//         "fontFamily",
//         "fontColor",
//         "fontBackgroundColor",
//         "|",
//         "bold",
//         "italic",
//         "underline",
//         "|",
//         "link",
//         "insertTable",
//         "highlight",
//         "blockQuote",
//         "|",
//         "alignment",
//         "|",
//         "bulletedList",
//         "numberedList",
//         "todoList",
//       ],
//       shouldNotGroupWhenFull: false,
//     },
//     plugins: [
//       AccessibilityHelp,
//       Alignment,
//       Autoformat,
//       Autosave,
//       BalloonToolbar,
//       BlockQuote,
//       Bold,
//       Essentials,
//       FindAndReplace,
//       FontBackgroundColor,
//       FontColor,
//       FontFamily,
//       FontSize,
//       Heading,
//       Highlight,
//       HorizontalLine,
//       Italic,
//       Link,
//       List,
//       ListProperties,
//       Paragraph,
//       RemoveFormat,
//       SelectAll,
//       Strikethrough,
//       Table,
//       TableCaption,
//       TableCellProperties,
//       TableColumnResize,
//       TableProperties,
//       TableToolbar,
//       TextTransformation,
//       TodoList,
//       Underline,
//       Undo,
//     ],
//     balloonToolbar: [
//       "bold",
//       "italic",
//       "|",
//       "link",
//       "|",
//       "bulletedList",
//       "numberedList",
//     ],
//     fontFamily: {
//       supportAllValues: true,
//     },
//     fontSize: {
//       options: [10, 12, 14, "default", 18, 20, 22],
//       supportAllValues: true,
//     },
//     heading: {
//       options: [
//         {
//           model: "paragraph",
//           title: "Paragraph",
//           class: "ck-heading_paragraph",
//         },
//         {
//           model: "heading1",
//           view: "h1",
//           title: "Heading 1",
//           class: "ck-heading_heading1",
//         },
//         {
//           model: "heading2",
//           view: "h2",
//           title: "Heading 2",
//           class: "ck-heading_heading2",
//         },
//         {
//           model: "heading3",
//           view: "h3",
//           title: "Heading 3",
//           class: "ck-heading_heading3",
//         },
//         {
//           model: "heading4",
//           view: "h4",
//           title: "Heading 4",
//           class: "ck-heading_heading4",
//         },
//         {
//           model: "heading5",
//           view: "h5",
//           title: "Heading 5",
//           class: "ck-heading_heading5",
//         },
//         {
//           model: "heading6",
//           view: "h6",
//           title: "Heading 6",
//           class: "ck-heading_heading6",
//         },
//       ],
//     },
//     initialData: initialContent,
//     language: "ko",
//     link: {
//       addTargetToExternalLinks: true,
//       defaultProtocol: "https://",
//       decorators: {
//         toggleDownloadable: {
//           mode: "manual",
//           label: "Downloadable",
//           attributes: {
//             download: "file",
//           },
//         },
//       },
//     },
//     list: {
//       properties: {
//         styles: true,
//         startIndex: true,
//         reversed: true,
//       },
//     },
//     menuBar: {
//       isVisible: true,
//     },
//     placeholder: "오늘의 일기를 작성하세요!",
//     table: {
//       contentToolbar: [
//         "tableColumn",
//         "tableRow",
//         "mergeTableCells",
//         "tableProperties",
//         "tableCellProperties",
//       ],
//     },
//     translations: [translations],
//   };

//   return (
//     <CKEditorContext context={Context} contextWatchdog={ContextWatchdog}>
//       <CKEditor
//         editor={ClassicEditor}
//         config={editorConfig}
//         data={initialContent}
//         onReady={(editor) => {
//           // You can store the "editor" and use when it is needed.
//           console.log("Editor 2 is ready to use!", editor);
//         }}
//       />
//     </CKEditorContext>
//   );
// }
