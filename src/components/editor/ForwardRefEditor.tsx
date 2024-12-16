import React, { forwardRef } from "react";

import Editor from "./InitializedMDXEditor";

import "./Editor.css";

// TODO: ensure props types are correct (specifically markdown)
type EditorProps = {
  markdown: any;
  onChange: Function;
};

const ForwardRefEditor = forwardRef((props: EditorProps, ref) => (
  <Editor {...props} editorRef={ref} />
));
export default ForwardRefEditor;
