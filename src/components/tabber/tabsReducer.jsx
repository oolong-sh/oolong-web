import Editor from '../editor/ForwardRefEditor';

export default function tabsReducer(state, action) {
  switch (action.type) {
    case 'select': {  // Parameters: index
      return {...state, activeIndex: action.index};
    }
    case 'open': {
      const newTab = {
        title: `Tab ${state.tabs.length + 1}`,
        content: <Editor markdown={`# Tab ${state.tabs.length + 1}`} />,
      }
      const newTabs = [...state.tabs, newTab];

      return {...state, tabs: newTabs};
    }
    case 'close': {  // Parameters: index
      const toDelete = state.tabs[action.index];
      const newTabs = state.tabs.filter((tab) => (toDelete != tab));
      // Clamp active index
      const newActiveIndex = Math.max(0, Math.min(state.activeIndex, newTabs.length - 1));

      // TODO keep same tab selected when closing to left of active

      return {...state, tabs: newTabs, activeIndex: newActiveIndex};
    }
    default: {
      console.error(`Invalid action: ${action.type}`);
      console.error(action);
    }
  }
}
