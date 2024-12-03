import { useCallback } from 'react';
import './TabHandle.css';
import { useAppContext } from '../../../../App';

export default function Tab({ id, title, isActive }) {
  const { setActiveId, closeDocument } = useAppContext();

  const selectTab = useCallback((event) => {
    // Avoids selecting tab when close button clicked
    if (!event.target.classList.contains('tab-title'))
      return;

    setActiveId(id);
  }, [setActiveId, id]);

  const closeTab = useCallback((event) => {
    closeDocument(id);
  }, [closeDocument, id]);

  return (
    <div className={'tab-handle' + (isActive ? ' active' : '')} onClick={selectTab}>
      <span className='tab-title'>{title}</span>
      <button className='tab-close' onClick={closeTab}><i className='bi bi-x'></i></button>
    </div>
  );
}
