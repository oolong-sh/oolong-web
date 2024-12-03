import  './Tabber.css';

import { useCallback } from 'react';

import TabHandle from './TabHandle';

import { useAppContext } from '../../../../App';
import TabContents from './TabContents';

export default function Tabber() {
  const {
    documents,
    openDocument,
  } = useAppContext();

  const newTab = useCallback(() => {
    openDocument({ title: 'New Note', content: '# New Note', saved: false });
  }, [openDocument]);

  const tabHandles = documents.map(tab => (
    <TabHandle key={tab.id} tab={tab} />
  ));

  const tabContents = documents.map(tab => (
    <TabContents key={tab.id} tab={tab} />
  ));

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
