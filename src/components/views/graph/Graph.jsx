import { useCallback, useEffect, useState } from 'react';
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import { API_BASE_URL } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../App';
import './Graph.css';

function defaultGraphData() {
  return {
    'nodes': [],
    'links': [],
  }
}

// Dark range and green from darkearth theme
const noteNodeColor = '#B36B42';
const keywordNodeColor = '#77824A';

const loColor = [61, 52, 44];
const hiColor = [215, 196, 132];

function styleGraphData(graphData) {
  const { nodes, links } = graphData;

  // Color nodes by group
  const newNodes = nodes.map(node => {
    const color = ('note' === node.group)
      ? noteNodeColor
      : keywordNodeColor;

    return {...node, color};
  });

  const newLinks = links.map(link => {
    // TODO magic number, normalize strength in Go code
    const strength = link.strength / 0.4;
    const color = [
      Math.round(loColor[0] * (1 - strength)) + (hiColor[0] * strength),
      Math.round(loColor[1] * (1 - strength)) + (hiColor[1] * strength),
      Math.round(loColor[2] * (1 - strength)) + (hiColor[2] * strength),
    ];
    const colorRGB = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    return {...link, color: colorRGB};
  });

  return {nodes: newNodes, links: newLinks};
}

export default function Graph() {
  const { loadDocument } = useAppContext();

  const [graphData, setGraphData] = useState(defaultGraphData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/graph`)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        setGraphData(styleGraphData(responseJson));
      })
      .catch(error => console.error(error));
  }, [setGraphData]);

  const navigate = useNavigate();

  const onNodeClick = useCallback(node => {
    if ('note' !== node.group)
      return;

    navigate('/notes');
    loadDocument(node.id, node.name);
  }, []);

  const [mode, setMode] = useState('2d');

  const ForceGraph = ((mode) => {
    switch (mode) {
      case '2d':
        return ForceGraph2D;
      case '3d':
        return ForceGraph3D;
      default:
        throw new Error(`Unrecognized graph mode ${mode}`);
    }
  })(mode);

  return (
    <div className='graph-wrapper'>
      <ForceGraph
        graphData={graphData}
        backgroundColor='#24211e'
        onNodeClick={onNodeClick} />
      <div className='graph-mode-selector'>
        <button
          className={('2d' === mode) ? 'active': ''}
          onClick={() => setMode('2d')}
        >2D</button>
        <button
          className={('3d' === mode) ? 'active': ''}
          onClick={() => setMode('3d')}
        >3D</button>
      </div>
    </div>
  );
}
