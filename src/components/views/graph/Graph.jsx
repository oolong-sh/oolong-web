import { ForceGraph2D } from 'react-force-graph';

const graphData = {
  "nodes": [
      {
        "id": "id1",
        "name": "name1",
        "val": 1,
      },
      {
        "id": "id2",
        "name": "name2",
        "val": 10,
      },
  ],
  "links": [
      {
          "source": "id1",
          "target": "id2",
      },
  ],
};

export default function Graph() {
  return (
    <ForceGraph2D graphData={graphData} />
  );
}
