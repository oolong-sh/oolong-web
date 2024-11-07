import  './Tabber.css';

import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import tabsReducer from './tabsReducer';
import TabHandle from './TabHandle';
import Editor from '../../editor/ForwardRefEditor';

import { useAppContext } from '../../../App';

const TabberContext = createContext();
export const useTabberContext = () => useContext(TabberContext);

export default function Tabber() {
  const { documents, createDocument, loadDocument } = useAppContext();

  const [tabsData, tabsDispatch] = useReducer(tabsReducer, {
    tabs: [],
    activeIndex: 1,
  });
  const editorRefs = useRef({});

  const openDocumentTab = useCallback((document) => {
    if (!editorRefs.current[document.id]) {
      editorRefs.current[document.id] = createRef();
    }
    const editorRef = editorRefs.current[document.id];

    const newTab = {
      id: document.id,
      title: document.title,
      content: <Editor ref={editorRef} markdown={document.content} />,
      editorRef,
    };

    tabsDispatch({ type: 'open', tab: newTab });
  }, []);

  const closeDocumentTab = useCallback((document) => {
    // TODO remove ref
    tabsDispatch({ type: 'close', id: document.id });
  }, []);

  const newDocumentTab = useCallback(() => {
    // TODO new tab
    // console.log(ref.current);
    // console.log(ref.current.getMarkdown());
    const newDocument = createDocument({ title: 'New Note', content: '# New Note' });
    openDocumentTab(newDocument);
  }, []);

  const loadDocumentTab = useCallback((path) => {
    // TODO load from real path
    loadDocument(`/loaded_${Date.now()}.md`, (doc) => {
      openDocumentTab(doc);
    });
  }, []);

  useEffect(() => {
    documents.forEach(doc => {
      openDocumentTab(doc);
    });

    return () => {
      documents.forEach(doc => closeDocumentTab(doc));
    }
  }, []);

  const tabHandles = tabsData.tabs.map((tab, index) => (
    <TabHandle key={tab.id} {...tab} index={index} />
  ));

  const tabContents = tabsData.tabs.map((tab, index) => {
    const isActive = (tabsData.activeIndex == index);

    return (
      <div key={tab.id} className={'tab-content' + (isActive ? ' active' : '')}>
        {tab.content}
      </div>
    );
  });

  return (
    <TabberContext.Provider value={{ tabsData, tabsDispatch }}>
      <div className="tabber">
        <div className="tab-bar">
          {tabHandles}
          <button className='tab-new' onClick={newDocumentTab}><i className='bi bi-plus'></i></button>
        </div>
        <div className='tab-contents'>
          {tabContents}
        </div>
      </div>
    </TabberContext.Provider>
  );
}
