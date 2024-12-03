import { useCallback, useState } from 'react';
import './ExplorerNode.css';
import { useAppContext } from '../../../../App';

export default function ExplorerNode({ node, level }) {
  const isDirectory = Boolean(Object.values(node.children).length);

  return isDirectory
    ? <ExplorerDirectoryNode node={node} level={level} />
    : <ExplorerDocumentNode node={node} level={level} />;
}

function ExplorerDirectoryNode({ node, level }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(flag => !flag);
  }, [setIsExpanded]);

  const nodeClassName = 'explorer-node directory' + (isExpanded ? ' expanded' : '');

  const caretIcon = <i className={'bi bi-caret' + (isExpanded ? '-down': '-right')} />;
  const nodeIcon = <i className={'bi bi-folder2' + (isExpanded ? '-open': '')} />;

  const childNodes = node.children.map(child => {
    return <ExplorerNode key={JSON.stringify(child)} node={child} level={level+1} />;
  });

  return (
    <div className={nodeClassName} style={{'--level': level}}>
      <button className='explorer-node-title' onClick={() => toggleExpanded()}>
        {caretIcon} {nodeIcon} {node.name}
      </button>
      <div className='explorer-node-children'>
        {childNodes}
      </div>
    </div>
  );
}

function ExplorerDocumentNode({ node, level }) {
  const { loadDocument } = useAppContext();

  const openSelf = useCallback(() => {
    loadDocument(node.path, node.name);
  }, [loadDocument]);

  return (
    <div className='explorer-node document' style={{'--level': level}}>
      <button className='explorer-node-title' title={node.path} onDoubleClick={() => openSelf()}>
        <i className='bi bi-file-text' /> {node.name}
      </button>
    </div>
  );
}
