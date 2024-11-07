import { createContext, useCallback, useContext, useReducer } from 'react';
import './App.css';
import AppHeader from './components/app-header/AppHeader';
import Tabber from './components/tabber/Tabber';
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

  const loadDocument = useCallback((path) => {
    // TODO: load document from remote server

    const newDocument = createDocument({
      path,
      title: 'loaded doc',
      content: 'loaded content',
    });

    return newDocument;
  }, []);

  const saveDocument = useCallback(() => {
    // TODO: save document to remote sync server
  }, []);

  return (
    <AppContext.Provider value={{ documents, documentsDispatch, createDocument, loadDocument, saveDocument }}>
      <AppHeader />
      <Tabber />
    </AppContext.Provider>
  )
}
