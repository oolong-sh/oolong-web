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
    case 'update': {  // update document properties in state array
      return documents.map(doc => (
        (doc.id === action.id)
          ? {...doc, ...action.document}
          : doc
      ));
    }
    default: {
      console.error(action);
      throw new Error(`Invalid action: ${action.type}`);
    }
  }
}
