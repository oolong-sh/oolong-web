import  './Tabber.css';

import {
  createContext,
  useContext,
  useReducer,
} from 'react';

import tabsReducer from './tabsReducer';
import TabHandle from './TabHandle';

import Editor from '../editor/ForwardRefEditor';

const TabberContext = createContext();

export default function Tabber() {
  const [tabsData, tabsDispatch] = useReducer(tabsReducer, {
    tabs: [
      {
        title: 'Tab 1',
        content: <Editor markdown={'# Tab 1'} />,
      },
      {
        title: 'Tab 2',
        content: <Editor markdown={'# Tab 2'} />,
      },
      {
        title: 'Tab 3',
        content: <Editor markdown={'# Tab 3'} />,
      },
    ],
    activeIndex: 1,
  });

  function newTab(event) {
    // TODO new tab
    tabsDispatch({ type: 'open' });
  }

  const tabHandles = tabsData.tabs.map((tab, index) => (
    <TabHandle key={tab.title} title={tab.title} index={index} />
  ));

  const tabContents = tabsData.tabs.map((tab, index) => {
    const isActive = (tabsData.activeIndex == index);

    return (
      <div key={tab.title} className={'tab-content' + (isActive ? ' active' : '')}>
        {tab.content}
      </div>
    );
  });

  return (
    <TabberContext.Provider value={[tabsData, tabsDispatch]}>
      <div className="tabber">
        <div className="tab-bar">
          {tabHandles}
          <button className='tab-new' onClick={newTab}><i className="bi bi-plus"></i></button>
        </div>
        <div className='tab-contents'>
          {tabContents}
        </div>
      </div>
    </TabberContext.Provider>
  );
}

export const useTabberContext = () => useContext(TabberContext);
