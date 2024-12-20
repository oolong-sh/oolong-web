import { MDXEditorMethods } from "@mdxeditor/editor";

export type Node = {
  name: string;
  path: string;
  children: Array<Node>;
};

export type AppDocument = {
  id?: string;
  path?: string;
  title?: string;
  content?: string;
  editorRef?: React.RefObject<MDXEditorMethods>;
  saved?: boolean;
};

export type AppCtx = {
  // Document state
  documents?: AppDocument[];

  // Document state modification
  addDocument?: (newDocument: AppDocument) => void;
  removeDocument?: (documentId: string) => void;
  updateDocument?: (newDocument: AppDocument) => void;

  // Available documents state
  fetchDocuments?: () => void;
  documentPaths?: string[];

  // Active document ID
  activeId?: string;
  setActiveId?: (activeId: string) => void;

  // Document manipulation
  openDocument?: (document: AppDocument) => void;
  closeDocument?: (documentId: string) => void;
  loadDocument?: (path: string, title: string) => void;
  saveDocument?: (documentId: string) => void;
};
