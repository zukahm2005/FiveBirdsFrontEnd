import React from "react";
import { Route, Routes } from "react-router-dom";
import BaseLayout from "./BaseLayout/BaseLayout";
import CreateTest from "./exam/createtest/CreateTest";
import LishExam from "./exam/listexam/LishExam";
import DashBoard from "./dashboard/DashBoard";
import InfoAdmin from "./infoAdmin/infoAdmin";
import ListManagerCandidate from "./listcandidate/ListManagerCandidate";
import LoginAdmin from "./loginAdmin/LoginAdmin";
import ProtectedRoute from "./protectedroute/ProtectedRoute";
import DetailExam from "./exam/detailexam/DetailExam";
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
      { path: "test/all-tests", element:<LishExam/>  },
      { path: "test/create-test", element: <CreateTest/>},
      { path: "administration", element: <InfoAdmin/> },
      { path: "manager-candidate", element: <ListManagerCandidate/>},
      { path: "detail-exam/:id", element: <DetailExam/> },
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
