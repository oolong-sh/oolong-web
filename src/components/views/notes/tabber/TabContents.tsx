import React, { memo, useCallback } from "react";
import { useAppContext } from "../../../../App";
import Editor from "../../../editor/ForwardRefEditor";

function tabOnKeyDown(event, appContextValue, tab) {
  const { closeDocument, saveDocument } = appContextValue;

  switch (event.key) {
    case "s": {
      if (event.ctrlKey) {
        event.preventDefault();
        saveDocument(tab.id);
      }
      break;
    }
    case "w": {
      // TODO this does not catch CTRL+W
      if (event.ctrlKey) {
        event.preventDefault();
        closeDocument(tab.id);
      }
      break;
    }
    default:
      break;
  }
}

function TabContents({ tab }) {
  const appContextValue = useAppContext();
  const { activeId, updateDocument }: any = appContextValue;
  const isActive = activeId === tab.id;

  const onChange = useCallback(
    (value) => {
      if (tab.saved && tab.content !== value) {
        updateDocument({ id: tab.id, saved: false });
      }
    },
    [tab, updateDocument],
  );

  return (
    <div
      className={"tab-content" + (isActive ? " active" : "")}
      onKeyDown={(event) => tabOnKeyDown(event, appContextValue, tab)}
    >
      {/* FIX: markdown prop */}
      <Editor ref={tab.editorRef} markdown={tab.content} onChange={onChange} />
    </div>
  );
}

export default memo(TabContents);
