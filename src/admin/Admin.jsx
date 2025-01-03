import React from "react";
import { Route, Routes } from "react-router-dom";
import BaseLayout from "./BaseLayout/BaseLayout";
import CreateTest from "./createtest/CreateTest";
import DashBoard from "./dashboard/DashBoard";
import InfoAdmin from "./infoAdmin/infoAdmin";
import ListManagerCandidate from "./listcandidate/ListManagerCandidate";
import LoginAdmin from "./loginAdmin/LoginAdmin";
import ProtectedRoute from "./protectedroute/ProtectedRoute";
const routes = [
  { path: "/login", element: <LoginAdmin /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <BaseLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <DashBoard /> },
      { path: "test/all-tests", element: <h2>All Tests Page</h2> },
      { path: "test/create-test", element: <CreateTest/>},
      { path: "administration", element: <InfoAdmin/> },
      { path: "manager-candidate", element: <ListManagerCandidate/>},
    ],
  },
];

export default function Admin() {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
          {route.children &&
            route.children.map((child, childIndex) => (
              <Route
                key={childIndex}
                path={child.path}
                element={child.element}
              />
            ))}
        </Route>
      ))}
    </Routes>
  );
}
