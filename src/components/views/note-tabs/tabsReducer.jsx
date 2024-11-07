function closeTabId(tabs, id) {
  return tabs.filter(tab => tab.id !== id);
}

function closeTabIndex(tabs, index) {
  const newTabs = [...tabs];
  newTabs.splice(index, 1);
  return newTabs;
}

export default function tabsReducer(state, action) {
  switch (action.type) {
    case 'select': {  // Parameters: id
      const newActiveIndex = state.tabs.findIndex(tab => tab.id === action.id);
      if (newActiveIndex < 0)
        return state;
      return {...state, activeIndex: newActiveIndex};
    }
    case 'select_index': {  // Parameters: index
      return {...state, activeIndex: action.index};
    }
    case 'open': {
      const newTabs = [...state.tabs, action.tab];
      return {...state, tabs: newTabs};
    }
    case 'close': {
      const newTabs = closeTabId(state.tabs, action.id);
      // Clamp active index
      // TODO keep same tab selected when closing to left of active
      const newActiveIndex = Math.max(0, Math.min(state.activeIndex, newTabs.length - 1));
      return {...state, tabs: newTabs, activeIndex: newActiveIndex};
    }
    case 'close_index': {  // Parameters: index
      const newTabs = closeTabIndex(state.tabs, action.index);
      // Clamp active index
      // TODO keep same tab selected when closing to left of active
      const newActiveIndex = Math.max(0, Math.min(state.activeIndex, newTabs.length - 1));
      return {...state, tabs: newTabs, activeIndex: newActiveIndex};
    }
    default: {
      console.error(action);
      throw new Error(`Invalid action: ${action.type}`);
    }
  }
}
