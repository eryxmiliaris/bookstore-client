import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function AppLayout() {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <NavBar />
      <div className="overflow-auto bg-violet-100">
        <main className="mx-auto max-w-5xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
