function findDocument(documents, id) {
  const document = documents.find(doc => doc.id === id);
  if (!document) {
    throw new Error(`Document with id ${id} not found`);
  }
  return document;
}

// TODO check for duplicate ids / paths

export default function documentsReducer(documents, action) {
  switch (action.type) {
    case 'add': {     // add document object to state array
      return [...documents, action.document];
    }
    case 'remove': {  // remove document from state array
      return documents.filter(doc => doc.id !== action.id);
    }
    case 'rename': {  // TODO rename doc: change id and path
      return documents;
    }
    default: {
      console.error(action);
      throw new Error(`Invalid action: ${action.type}`);
    }
  }
}
