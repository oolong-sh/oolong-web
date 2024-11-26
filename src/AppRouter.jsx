import { createBrowserRouter, createHashRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import isElectron from 'is-electron';

import App from './App';
import NotesView from './components/views/note-tabs/Tabber';
import GraphView from './components/views/graph/Graph';

export default function AppRouter() {
  const router = createRouter(
    createRoutesFromElements(
      <Route path='/' element={<App />}>
        <Route path='' element={<Navigate to='/notes' />} />
        <Route path='notes' element={<NotesView />} />
        <Route path='graph' element={<GraphView />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

function createRouter(routes) {
  return isElectron()
    ? createHashRouter(routes)
    : createBrowserRouter(routes);
}
