import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/AuthContext";

import AppLayout from "./components/AppLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import User from "./components/User";
import Admin from "./components/Admin";
import BookPage from "./pages/BookPage";
import CataloguePage from "./pages/CataloguePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to="books" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user" element={<User />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/books" element={<CataloguePage />} />
              <Route path="/books/:id" element={<BookPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
