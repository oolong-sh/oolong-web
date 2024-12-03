import { createContext, createRef, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import AppSidebar from './components/app-sidebar/AppSidebar';
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

export default function App() {
  const [documentPaths, setDocumentPaths] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeId, setActiveId] = useState('');

  // Add a document to the local state array
  const addDocument = useCallback(newDocument => {
    setDocuments(docs => [...docs, newDocument]);
  }, [setDocuments]);

  // Remove a document from the local state array
  const removeDocument = useCallback(documentId => {
    setDocuments(docs => {
      let newIndex = docs.findIndex(doc => doc.id === documentId);
      const newDocs = docs.filter(doc => doc.id !== documentId);

      if (newIndex < 0)
        throw new Error(`Document with ID ${documentId} not found`);

      // Decrement if new index overflows document array
      if (newIndex >= newDocs.length) {
        newIndex = newDocs.length - 1;
      }

      // Deselect if last tab was closed
      const newId = (newIndex >= 0)
        ? newDocs[newIndex].id
        : '';

      setActiveId(activeId => {
        if (activeId !== documentId) {
          // Keep current tab selected if it is not being closed
          return activeId;
        } else {
          return newId;
        }
      });

      return newDocs;
    });
  }, [setDocuments, setActiveId]);

  // Update a document in the local state array
  const updateDocument = useCallback(newDocument => {
    setDocuments(docs => {
      return docs.map(doc => (
        (doc.id === newDocument.id)
          ? {...doc, ...newDocument}
          : doc
      ));
    });
  }, [setDocuments]);

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
    const { path='', title='', content='', saved=true } = document;

    const newDocument = {
      id: (path ? path : `new_doc_${Date.now()}`),
      path,
      title,
      content,
      editorRef: createRef(),
      saved,
    };

    addDocument(newDocument);
    setActiveId(newDocument.id);
    return newDocument;
  }, [addDocument]);

  const closeDocument = useCallback((documentId) => {
    removeDocument(documentId);
  }, [removeDocument]);

  // Load a document from the note server
  const loadDocument = useCallback((path, title) => {
    fetch(`${API_BASE_URL}/note?path=${encodeURIComponent(path)}`)
      .then(responseStatusCheck)
      .then(response => response.json())
      .then(content => {
        const existingDocument = documents.find(doc => doc.path === path);

        if (existingDocument === undefined) {
          openDocument({ path, title, content });
        } else {
          const newDocument = {
            ...existingDocument,
            path,
            title,
            content,
          };

          updateDocument(newDocument);
          setActiveId(newDocument.id);
        }
      })
      .catch(error => console.error(error));
  }, [documents, updateDocument, openDocument]);

  // Save a document to the note server
  const saveDocument = useCallback((documentId) => {
    const document = findDocument(documentId);

    // TODO change request method if creating document
    const isNew = false;

    // Update content property on document object
    const content = document.editorRef.current.getMarkdown();
    updateDocument({ id: documentId, content, saved: true });

    fetch(`${API_BASE_URL}/note`, {
      method: isNew ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: document.path,
        content,
      }),
    })
      .then(response => response.json())
      .then(responseJson => console.log(responseJson))  // TODO process response?
      .catch(error => console.error(error));
  }, [findDocument, updateDocument]);

  // Delete a document from the note server
  const deleteDocument = useCallback((documentId) => {
    // Remove from local state array
    removeDocument(documentId);

    fetch(`${API_BASE_URL}/note`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: document.path,
      }),
    })
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
    // Document state modification
    addDocument,
    removeDocument,
    updateDocument,
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
