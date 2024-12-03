import  './Tabber.css';

import { useCallback } from 'react';

import TabHandle from './TabHandle';
import Editor from '../../../editor/ForwardRefEditor';

import { useAppContext } from '../../../../App';

export default function Tabber() {
  const {
    documents,
    activeId,
    openDocument,
    closeDocument,
    saveDocument,
  } = useAppContext();

  const newTab = useCallback(() => {
    openDocument({ title: 'New Note', content: '# New Note' });
  }, [openDocument]);

  const tabOnKeyDown = useCallback((event, tab) => {
    switch (event.key) {
      case 's': {
        if (event.ctrlKey) {
          event.preventDefault();
          saveDocument(tab.id);
        }
        break;
      }
      case 'w': {
        // TODO this does not catch CTRL+W
        if (event.ctrlKey) {
          event.preventDefault();
          closeDocument(tab.id);
        }
        break;
      }
      default:
        break;
    }
  }, [closeDocument, saveDocument]);

  const tabHandles = documents.map((tab) => {
    const isActive = (activeId === tab.id);

    return <TabHandle key={tab.id} {...tab} isActive={isActive} />
  });

  const tabContents = documents.map((tab) => {
    const isActive = (activeId === tab.id);

    return (
      <div
        key={tab.id}
        className={'tab-content' + (isActive ? ' active' : '')}
        onKeyDown={(event) => tabOnKeyDown(event, tab)}
      >
        <Editor ref={tab.editorRef} markdown={tab.content} />
      </div>
    );
  });

  return (
    <div className="tabber fill">
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
