import { useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { API_BASE_URL } from '../../../constants';

function defaultGraphData() {
  return {
    'nodes': [],
    'links': [],
  }
}

const loColor = [61, 52, 44];
const hiColor = [215, 196, 132];

function styleGraphData(graphData) {
  const { nodes, links } = graphData;

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

  return {nodes, links: newLinks};
}

export default function Graph() {
  const [graphData, setGraphData] = useState(defaultGraphData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/graph`)
      .then(response => response.json())
      .then(responseJson => {
        // TODO process data before usage?
        console.log(responseJson);
        setGraphData(styleGraphData(responseJson));
      })
      .catch(error => console.error(error));
  }, [setGraphData]);

  return (
    <ForceGraph2D graphData={graphData} />
  );
}
