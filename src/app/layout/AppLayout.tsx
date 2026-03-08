import { Outlet } from "react-router-dom";
import { AppHeader } from "../../shared/components/AppHeader";
import { AppSidebar } from "../../shared/components/AppSidebar";

export function AppLayout() {
  return (
    <div className="app-shell">
      <AppSidebar />

      <div className="app-main">
        <AppHeader />

        <main className="app-content p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}