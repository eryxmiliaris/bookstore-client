import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/AuthContext";

import AppLayout from "./components/AppLayout";
import Profile from "./pages/Profile";
import BookPage from "./pages/BookPage";
import CataloguePage from "./pages/CataloguePage";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";
import theme from "./util/theme";
import { ThemeProvider } from "@mui/material";
import WishList from "./pages/Wishlist";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./features/auth/SignIn";
import SignUp from "./features/auth/SignUp";

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
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/wishlist" element={<WishList />} />
                </Route>

                <Route index element={<Navigate replace to="books" />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/books" element={<CataloguePage />} />
                <Route path="/books/:id" element={<BookPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
