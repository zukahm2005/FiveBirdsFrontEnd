import React from "react";
import { Route, Routes } from "react-router-dom";
import BaseLayout from "./BaseLayout/BaseLayout";
import CreateTest from "./exam/createtest/CreateTest";
import LishExam from "./exam/listexam/LishExam";
import DashBoard from "./dashboard/DashBoard";
import ListManagerCandidate from "./listcandidate/ListManagerCandidate";
import LoginAdmin from "./loginAdmin/LoginAdmin";
import ProtectedRoute from "./protectedroute/ProtectedRoute";
import DetailExam from "./exam/detailexam/DetailExam";
import UserExam from "./userExam/UserExam";
import PositionManagement from "./positionManagement/PositionManagement.jsx";
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
      { path: "exam/all-exams", element:<LishExam/>  },
      { path: "exam/create-exam", element: <CreateTest/>},
      { path: "administration", element: <UserExam/> },
      { path: "manager-candidate", element: <ListManagerCandidate/>},
      {path: "position", element: <PositionManagement/>},
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
