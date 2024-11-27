import { useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';

export default function Graph() {
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/graph`)
      .then(response => response.json())
      .then(responseJson => {
        // TODO process data before usage?
        console.log(responseJson);
        setGraphData(responseJson);
      })
      .catch(error => console.error(error));
  }, [setGraphData]);

  return (
    <ForceGraph2D graphData={graphData} />
  );
}
