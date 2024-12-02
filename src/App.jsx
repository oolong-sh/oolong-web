import { createContext, createRef, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import AppSidebar from './components/app-sidebar/AppSidebar';
import documentsReducer from './documentReducer';
import { API_BASE_URL } from './constants';
import { responseStatusCheck } from './utils';

/*
https://github.com/vasturiano/react-force-graph
https://github.com/dhotson/springy

https://github.com/react-monaco-editor/react-monaco-editor
https://github.com/codemirror/dev
https://www.npmjs.com/package/react-markdown

https://pandoc.org/
https://www.npmjs.com/package/node-pandoc


https://www.svgrepo.com/svg/490398/tea-cup?edit=true
*/

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const defaultDocuments = [
  {
    'id': '/tab1.md',
    'path': '/tab1.md',
    'title': 'Tab 1',
    'content': '# Tab 1',
    editorRef: createRef(),
  },
  {
    'id': '/tab2.md',
    'path': '/tab2.md',
    'title': 'Tab 2',
    'content': '# Tab 2',
    editorRef: createRef(),
  },
  {
    'id': '/tab3.md',
    'path': '/tab3.md',
    'title': 'Tab 3',
    'content': '# Tab 3',
    editorRef: createRef(),
  },
];

export default function App() {
  const [documentPaths, setDocumentPaths] = useState([]);
  const [documents, documentsDispatch] = useReducer(documentsReducer, defaultDocuments);
  const [activeId, setActiveId] = useState(defaultDocuments[0].id);

  // Get all notes from the note server
  const fetchDocuments = useCallback(() => {
    fetch(`${API_BASE_URL}/notes`)
      .then(responseStatusCheck)
      .then(response => response.json())
      .then(responseJson => setDocumentPaths(responseJson))
      .catch(error => console.error(error));
  }, [setDocumentPaths]);

  const findDocument = useCallback((documentId) => {
    const document = documents.find(doc => documentId === doc.id);

    if (document === null) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    return document;
  }, [documents]);

  // Create a new document locally
  const openDocument = useCallback((document) => {
    const { path='', title='', content='' } = document;

    const newDocument = {
      id: (path ? path : `new_doc_${Date.now()}`),
      path,
      title,
      content,
      editorRef: createRef(),
    };

    documentsDispatch({ type: 'add', document: newDocument });
    return newDocument;
  }, [documentsDispatch]);

  const closeDocument = useCallback((documentId) => {
    // TODO set new active ID

    documentsDispatch({ type: 'remove', id: documentId });
  }, [documentsDispatch]);

  // Load a document from the note server
  const loadDocument = useCallback((path) => {
    // TODO update content if note exists locally
    // TODO set title
    const fetchPromise = fetch(`${API_BASE_URL}/note?path=${encodeURIComponent(path)}`)
      .then(responseStatusCheck)
      .then(response => response.json())
      .then(content => {
        const newDocument = openDocument({
          path,
          title: 'Loaded Document',
          content: content,
        });

        documentsDispatch({ type: 'add', document: newDocument });
        return newDocument;
      })
      .catch(error => console.error(error));

    // TODO test (should return newDocument?)
    return fetchPromise.resolve();
  }, [documentsDispatch]);

  // Save a document to the note server
  const saveDocument = useCallback((documentId) => {
    const document = findDocument(documentId);

    // TODO change request method if creating document
    const isNew = false;

    // Update content property on document object
    const content = document.editorRef.current.getMarkdown();
    documentsDispatch({ type: 'update', id: documentId, document: {content} });

    fetch(`${API_BASE_URL}/note/${documentId}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: document.path,
        content: content,
      }),
    })
      .then(response => response.json())
      .then(responseJson => console.log(responseJson))  // TODO process response?
      .catch(error => console.error(error));
  }, [documentsDispatch, findDocument]);

  // Delete a document from the note server
  const deleteDocument = useCallback((documentId) => {
    // Remove from local state array
    documentsDispatch({ type: 'remove', id: documentId, document: {content} });

    fetch(`${API_BASE_URL}/note/${documentId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(responseJson => console.log(responseJson))  // TODO process response?
      .catch(error => console.error(error));
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const appContextValue = {
    // Document state
    documents,
    documentsDispatch,
    // Available documents state
    fetchDocuments,
    documentPaths,
    // Active document ID
    activeId,
    setActiveId,
    // Document manipulation
    openDocument,
    closeDocument,
    loadDocument,
    saveDocument,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <AppSidebar />
      <div className='app-content'>
        <main className='main-content'>
          <Outlet />
        </main>
      </div>
    </AppContext.Provider>
  );
}
