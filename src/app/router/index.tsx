import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { RegistrosListPage } from "../../features/registros/pages/RegistrosListPage";
import { RegistroCreatePage } from "../../features/registros/pages/RegistroCreatePage";
import { RegistroEditPage } from "../../features/registros/pages/RegistroEditPage";
import { AprobacionesListPage } from "../../features/aprobaciones/pages/AprobacionesListPage";
import { AprobacionDetailPage } from "../../features/aprobaciones/pages/AprobacionDetailPage";
import { PublicRegistroPage } from "../../features/aprobaciones/pages/PublicRegistroPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/registros" replace /> },
          { path: "registros", element: <RegistrosListPage /> },
          { path: "registros/nuevo", element: <RegistroCreatePage /> },
          { path: "registros/:id/editar", element: <RegistroEditPage /> },
          { path: "aprobaciones", element: <AprobacionesListPage /> },
          { path: "aprobaciones/:id", element: <AprobacionDetailPage /> },
        ],
      },
    ],
  },
  {
    path: "/public/r/:slug",
    element: <PublicRegistroPage />,
  },
]);