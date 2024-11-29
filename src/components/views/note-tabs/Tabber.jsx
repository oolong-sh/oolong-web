import  './Tabber.css';

import { useCallback } from 'react';

import TabHandle from './TabHandle';
import Editor from '../../editor/ForwardRefEditor';

import { useAppContext } from '../../../App';

export default function Tabber() {
  const {
    documents,
    activeId,
    loadDocument,
    openDocument,
  } = useAppContext();

  const newTab = useCallback(() => {
    openDocument({ title: 'New Note', content: '# New Note' });
  }, [openDocument]);

  const loadDocumentTab = useCallback((path) => {
    // TODO load from real path
    loadDocument(`/loaded_${Date.now()}.md`, (doc) => {
      openDocumentTab(doc);
    });
  }, []);

  const tabHandles = documents.map((tab) => {
    const isActive = (activeId === tab.id);

    return <TabHandle key={tab.id} {...tab} isActive={isActive} />
  });

  const tabContents = documents.map((tab) => {
    const isActive = (activeId === tab.id);

    return (
      <div key={tab.id} className={'tab-content' + (isActive ? ' active' : '')}>
        <Editor ref={tab.editorRef} markdown={tab.content} />
      </div>
    );
  });

  return (
    <div className="tabber">
      <div className="tab-bar">
        {tabHandles}
        <button className='tab-new' onClick={newTab}><i className='bi bi-plus'></i></button>
      </div>
      <div className='tab-contents'>
        {tabContents}
      </div>
    </div>
  );
}
