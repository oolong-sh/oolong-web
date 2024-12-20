import React, { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { API_BASE_URL } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../App";
import "./Graph.css";
import { AppCtx } from "../../../types";

type GraphNode = {
  id: string;
  name: string;
  group: string;
  val: number;
};

type GraphLink = {
  source: string;
  target: string;
  strength: number;
  color: string;
};

function defaultGraphData() {
  return {
    nodes: [],
    links: [],
  };
}

function getNodeColor(node: GraphNode) {
  switch (node.group) {
    case "note":
      return "#B36B42"; // Dark orange
    case "keyword":
      return "#77824A"; // Green
    default:
      return "#ffffff";
  }
}

const loColor = [61, 52, 44];
const hiColor = [215, 196, 132];

function getLinkColor(link: GraphLink) {
  // TODO magic number, normalize strength in Go code
  const strength = link.strength / 0.4;

  const color = [
    Math.round(loColor[0] * (1 - strength)) + hiColor[0] * strength,
    Math.round(loColor[1] * (1 - strength)) + hiColor[1] * strength,
    Math.round(loColor[2] * (1 - strength)) + hiColor[2] * strength,
  ];

  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

export default function Graph() {
  const { loadDocument }: AppCtx = useAppContext();

  const [graphData, setGraphData] = useState(defaultGraphData);

  useEffect(() => {
    fetch(`${API_BASE_URL}/graph`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setGraphData(responseJson);
      })
      .catch((error) => console.error(error));
  }, [setGraphData]);

  // Graph size must be specified to auto-resize

  const wrapperRef = useRef(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);

  const onWindowResize = useCallback(() => {
    const bounds = wrapperRef.current.getBoundingClientRect();
    setGraphWidth(bounds.width);
    setGraphHeight(bounds.height);
  }, [wrapperRef]);

  useEffect(() => {
    onWindowResize();
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, [onWindowResize]);

  const navigate = useNavigate();

  const onNodeClick = useCallback((node: GraphNode) => {
    if ("note" !== node.group) return;

    navigate("/notes");
    loadDocument(node.id, node.name);
  }, []);

  const [use3D, setUse3D] = useState(false);

  const ForceGraph = use3D ? ForceGraph3D : ForceGraph2D;

  return (
    <div ref={wrapperRef} className="graph-wrapper">
      <ForceGraph
        graphData={graphData}
        width={graphWidth}
        height={graphHeight}
        backgroundColor="#24211e"
        linkColor={getLinkColor}
        nodeColor={getNodeColor}
        onNodeClick={onNodeClick}
      />
      <div className="graph-mode-selector">
        <button
          className={use3D ? "" : "active"}
          onClick={() => setUse3D(false)}
        >
          2D
        </button>
        <button
          className={use3D ? "active" : ""}
          onClick={() => setUse3D(true)}
        >
          3D
        </button>
      </div>
    </div>
  );
}
