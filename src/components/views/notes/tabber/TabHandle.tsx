import React, { useCallback } from "react";
import "./TabHandle.css";
import { useAppContext } from "../../../../App";
import { AppCtx } from "../../../../types";

export default function Tab({ tab }) {
  const { activeId, setActiveId, closeDocument }: AppCtx = useAppContext();
  const isActive = activeId === tab.id;

  const selectTab = useCallback(
    (event) => {
      // Avoids selecting tab when close button clicked
      if (!event.target.classList.contains("tab-title")) return;

      setActiveId(tab.id);
    },
    [tab, setActiveId],
  );

  const closeTab = useCallback(() => {
    closeDocument(tab.id);
  }, [tab, closeDocument]);

  return (
    <div
      className={"tab-handle" + (isActive ? " active" : "")}
      onClick={selectTab}
    >
      <span className="tab-title">{tab.title + (tab.saved ? "" : "*")}</span>
      <button className="tab-close" onClick={closeTab}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}
