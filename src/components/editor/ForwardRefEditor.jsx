import { forwardRef } from 'react';

import Editor from './InitializedMDXEditor';

const ForwardRefEditor = forwardRef((props, ref) => <Editor {...props} editorRef={ref} />);
export default ForwardRefEditor;
