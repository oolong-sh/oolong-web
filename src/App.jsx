import { createContext, useCallback, useContext, useReducer } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import AppSidebar from './components/app-sidebar/AppSidebar';
import documentsReducer from './documentReducer';

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
  },
  {
    'id': '/tab2.md',
    'path': '/tab2.md',
    'title': 'Tab 2',
    'content': '# Tab 2',
  },
  {
    'id': '/tab3.md',
    'path': '/tab3.md',
    'title': 'Tab 3',
    'content': '# Tab 3',
  },
];

export default function App() {
  const [documents, documentsDispatch] = useReducer(documentsReducer, defaultDocuments);

  const createDocument = useCallback((document) => {
    const { path='', title='', content='' } = document;

    const newDocument = {
      id: (path ? path : `new_doc_${Date.now()}`),
      path,
      title,
      content,
    };

    documentsDispatch({ type: 'add', document: newDocument });
    return newDocument;
  }, []);

  const loadDocument = useCallback((path, onLoad) => {
    // TODO: load document from remote server
    fetch('https://raw.githubusercontent.com/oolong-sh/oolong-web/refs/heads/main/README.md')
      .then(response => response.text())
      .then(content => {
        const newDocument = createDocument({
          path,
          title: 'Loaded Document',
          content: content,
        });

        documentsDispatch({ type: 'add', document: newDocument });
        return newDocument;
      })
      .then(doc => {
        if (onLoad)
          onLoad(doc);
      })
      .catch(error => console.error(error));
  }, []);

  const saveDocument = useCallback(() => {
    // TODO: save document to remote sync server
  }, []);

  const appContextValue = {
    documents,
    documentsDispatch,
    createDocument,
    loadDocument,
    saveDocument,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <AppSidebar />
      <main className='main-content'>
        <Outlet />
      </main>
    </AppContext.Provider>
  );
}
