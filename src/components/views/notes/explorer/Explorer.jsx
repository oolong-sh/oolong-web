import { useEffect, useState } from 'react';
import { useAppContext } from '../../../../App';
import { toTree } from '../../../../utils';
import ExplorerNode from './ExplorerNode';
import './Explorer.css';

export default function Explorer() {
  const { documentPaths } = useAppContext();

  const [fileTree, setFileTree] = useState({});

  useEffect(() => {
    if (!documentPaths)
      return;
    setFileTree(toTree(documentPaths));
  }, [documentPaths, setFileTree])

  return (
    <aside className='explorer'>
      <div className='explorer-content'>
        <ExplorerNode name='root' level={1} children={fileTree} />
      </div>
    </aside>
  );
}
