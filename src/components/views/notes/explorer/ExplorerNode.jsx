import './ExplorerNode.css';

export default function ExplorerNode({ name, children }) {
  const isDirectory = Boolean(children.length);

  const childNodes = Object.entries(children).map(([name, children]) => {
    return <ExplorerNode key={name} name={name} children={children} />;
  });

  return (
    <div className='explorer-node'>
      <div className='explorer-node-title'>{name}</div>
      <div className='explorer-node-children'>
        {childNodes}
      </div>
    </div>
  );
}
