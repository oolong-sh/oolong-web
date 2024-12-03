import { useEffect, useState } from 'react';
import { useAppContext } from '../../../../App';
import { collapseChildren, toTree } from '../../../../utils';
import ExplorerNode from './ExplorerNode';
import './Explorer.css';

export default function Explorer() {
  const { documentPaths } = useAppContext();

  const [fileTree, setFileTree] = useState([]);

  useEffect(() => {
    if (!documentPaths)
      return;
    setFileTree(toTree(documentPaths));
  }, [documentPaths, setFileTree]);

  const rootNode = {
    name: '',
    children: fileTree,
  };
  collapseChildren(rootNode);

  return (
    <aside className='explorer'>
      <div className='explorer-content'>
        <ExplorerNode node={rootNode} level={1} />
      </div>
    </aside>
  );
}
