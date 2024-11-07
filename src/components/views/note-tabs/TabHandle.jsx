import './TabHandle.css';
import { useTabberContext } from './Tabber';

export default function Tab({ id, title, index }) {
  const { tabsData, tabsDispatch } = useTabberContext();

  function selectTab(event) {
    // Avoids selecting tab when close button clicked
    if (event.target.classList.contains('tab-close'))
      return;

    tabsDispatch({ type: 'select_index', index });
  }

  function closeTab(event) {
    tabsDispatch({ type: 'close', id });
  }

  const isActive = (tabsData.activeIndex === index);

  return (
    <div className={'tab-handle' + (isActive ? ' active' : '')} onClick={selectTab}>
      <span className='tab-title'>{title}</span>
      <button className='tab-close' onClick={closeTab}><i className='bi bi-x'></i></button>
    </div>
  );
}
