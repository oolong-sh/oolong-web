import { memo } from 'react';
import { useAppContext } from '../../../../App';
import Editor from '../../../editor/ForwardRefEditor';

function tabOnKeyDown(event, appContextValue, tab) {
  const { closeDocument, saveDocument } = appContextValue;

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
}

function TabContents({ tab }) {
  const appContextValue = useAppContext();
  const isActive = (appContextValue.activeId === tab.id);

  return (
    <div
      className={'tab-content' + (isActive ? ' active' : '')}
      onKeyDown={(event) => tabOnKeyDown(event, appContextValue, tab)}
    >
      <Editor ref={tab.editorRef} markdown={tab.content} />
    </div>
  );
}

export default memo(TabContents);
