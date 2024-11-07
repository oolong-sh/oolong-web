import { Link, useLocation } from 'react-router-dom';

import './AppSidebar.css';

const appViews = [
  {
    name: 'Notes',
    icon: 'journal-text',
    path: '/notes',
  },
  {
    name: 'Graph',
    icon: 'share',
    path: '/graph',
  },
];

export default function AppSidebar() {
  const location = useLocation();

  const sidebarButtons = appViews.map((view) => {
    const isActive = location.pathname == view.path;
    const buttonActiveClass = isActive ? ' active': '';

    return (
      <Link key={view.name} className={'app-sidebar-button' + buttonActiveClass} title={view.name} to={view.path}>
          <i className={`bi bi-${view.icon}`}></i>
      </Link>
    );
  });

  return (
    <aside className='app-sidebar'>
      {sidebarButtons}
    </aside>
  );
}
