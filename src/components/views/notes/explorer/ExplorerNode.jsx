import { useCallback, useState } from 'react';
import './ExplorerNode.css';
import { useAppContext } from '../../../../App';

// TODO key cannot be used as prop (rework treeifier to access path)
export default function ExplorerNode({ key, name, children }) {
  const isDirectory = Boolean(Object.values(children).length);

  return isDirectory
    ? <ExplorerDirectoryNode key={key} name={name} children={children} />
    : <ExplorerDocumentNode key={key} name={name} />;
}

function ExplorerDirectoryNode({ key, name, children }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(flag => !flag);
  }, [setIsExpanded]);

  const nodeClassName = 'explorer-node directory' + (isExpanded ? ' expanded' : '');

  const caretIcon = <i className={'bi bi-caret' + (isExpanded ? '-down': '-right')} />;
  const nodeIcon = <i className={'bi bi-folder2' + (isExpanded ? '-open': '')} />;

  const childNodes = Object.entries(children).map(([name, children]) => {
    return <ExplorerNode key={`${key}/${name}`} name={name} children={children} />;
  });

  return (
    <div className={nodeClassName}>
      <button className='explorer-node-title' onClick={() => toggleExpanded()}>
        {caretIcon} {nodeIcon} {name}
      </button>
      <div className='explorer-node-children'>
        {childNodes}
      </div>
    </div>
  );
}

function ExplorerDocumentNode({ name }) {
  const { loadDocument } = useAppContext();

  const openSelf = useCallback(() => {
    // TODO get path from node (rework treeifier)
    loadDocument('');
  }, [loadDocument]);

  return (
    <div className='explorer-node document'>
      <button className='explorer-node-title' onClick={() => openSelf()}>
        <i className='bi bi-file-text' /> {name}
      </button>
    </div>
  );
}
