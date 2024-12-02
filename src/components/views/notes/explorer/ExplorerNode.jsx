import { useCallback, useState } from 'react';
import './ExplorerNode.css';
import { useAppContext } from '../../../../App';

// TODO key cannot be used as prop (rework treeifier to access path)
export default function ExplorerNode({ key, name, level, children }) {
  const isDirectory = Boolean(Object.values(children).length);

  return isDirectory
    ? <ExplorerDirectoryNode key={key} name={name} level={level} children={children} />
    : <ExplorerDocumentNode key={key} name={name} level={level} />;
}

function ExplorerDirectoryNode({ key, name, level, children }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(flag => !flag);
  }, [setIsExpanded]);

  const nodeClassName = 'explorer-node directory' + (isExpanded ? ' expanded' : '');

  const caretIcon = <i className={'bi bi-caret' + (isExpanded ? '-down': '-right')} />;
  const nodeIcon = <i className={'bi bi-folder2' + (isExpanded ? '-open': '')} />;

  const childNodes = Object.entries(children).map(([name, children]) => {
    return <ExplorerNode key={`${key}/${name}`} name={name} level={level+1} children={children} />;
  });

  return (
    <div className={nodeClassName} style={{'--level': level}}>
      <button className='explorer-node-title' onClick={() => toggleExpanded()}>
        {caretIcon} {nodeIcon} {name}
      </button>
      <div className='explorer-node-children'>
        {childNodes}
      </div>
    </div>
  );
}

function ExplorerDocumentNode({ name, level }) {
  const { loadDocument } = useAppContext();

  const openSelf = useCallback(() => {
    // TODO get path from node (rework treeifier)
    loadDocument('');
  }, [loadDocument]);

  return (
    <div className='explorer-node document' style={{'--level': level}}>
      <button className='explorer-node-title' onClick={() => openSelf()}>
        <i className='bi bi-file-text' /> {name}
      </button>
    </div>
  );
}
