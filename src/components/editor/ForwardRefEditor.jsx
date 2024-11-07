import { forwardRef } from 'react';

import Editor from './InitializedMDXEditor';

import './Editor.css';

const ForwardRefEditor = forwardRef((props, ref) => <Editor {...props} editorRef={ref} />);
export default ForwardRefEditor;
