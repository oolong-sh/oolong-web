import  './Tabber.css';

import { useCallback } from 'react';

import TabHandle from './TabHandle';

import { useAppContext } from '../../../../App';
import TabContents from './TabContents';

export default function Tabber() {
  const {
    documents,
    activeId,
    openDocument,
  } = useAppContext();

  const newTab = useCallback(() => {
    openDocument({ title: 'New Note', content: '# New Note' });
  }, [openDocument]);

  const tabHandles = documents.map((tab) => {
    const isActive = (activeId === tab.id);

    return <TabHandle key={tab.id} {...tab} isActive={isActive} />
  });

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
