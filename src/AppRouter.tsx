import React from "react";
import {
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import isElectron from "is-electron";

import App from "./App";
import NotesView from "./components/views/notes/Notes";
import GraphView from "./components/views/graph/Graph";

export default function AppRouter() {
  const router = createRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="" element={<Navigate to="/notes" />} />
        <Route path="notes" element={<NotesView />} />
        <Route path="graph" element={<GraphView />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

function createRouter(routes: RouteObject[]) {
  return isElectron() ? createHashRouter(routes) : createBrowserRouter(routes);
}
