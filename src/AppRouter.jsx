import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';

import App from './App';
import Tabber from './components/tabber/Tabber';

function AppRouter() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<App />}>
        <Route path='' element={<Navigate to='/notes' />} />
        <Route path='notes' element={<Tabber />} />
        <Route path='graph' element={<></>} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default AppRouter;
