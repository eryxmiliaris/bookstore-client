import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./features/auth/AuthContext";

import AppLayout from "./components/AppLayout";
import ProfilePage from "./pages/ProfilePage";
import BookPage from "./pages/BookPage";
import CataloguePage from "./pages/CataloguePage";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";
import theme from "./util/theme";
import { ThemeProvider } from "@mui/material";
import WishListPage from "./pages/WishListPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./features/auth/SignIn";
import SignUp from "./features/auth/SignUp";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import LibraryPage from "./pages/LibraryPage";
import AddBook from "./features/admin/AddBook";
import EditBook from "./features/admin/EditBook";
import Orders from "./features/admin/Orders";
import Reviews from "./features/admin/Reviews";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import HomePage from "./pages/HomePage";
import NotFound from "./components/NotFound";
import EbookReader from "./pages/EbookReader";
import AudiobookPlayer from "./pages/AudiobookPlayer";
import { LocalCartProvider } from "./features/cart/LocalCartContext";

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
            <LocalCartProvider>
              <Routes>
                <Route path="/reader/:id" element={<EbookReader />} />

                <Route element={<AppLayout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                      path="/profile/wishlist"
                      element={<WishListPage />}
                    />
                    <Route path="/profile/library" element={<LibraryPage />} />
                    <Route
                      path="/profile/orders"
                      element={<OrderHistoryPage />}
                    />
                    <Route path="/admin/addBook" element={<AddBook />} />
                    <Route path="/admin/editBook/:id" element={<EditBook />} />
                    <Route path="/admin/orders" element={<Orders />} />
                    <Route path="/admin/reviews" element={<Reviews />} />
                  </Route>

                  <Route path="/player/:id" element={<AudiobookPlayer />} />

                  <Route index element={<Navigate replace to="home" />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot" element={<ForgotPassword />} />
                  <Route path="/reset" element={<ResetPassword />} />
                  <Route path="/books" element={<CataloguePage />} />
                  <Route path="/books/:id" element={<BookPage />} />
                  <Route path="/profile/cart" element={<CartPage />} />
                  <Route
                    path="/subscriptions"
                    element={<SubscriptionsPage />}
                  />

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </LocalCartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <Toaster
        toastOptions={{
          className: "",
          duration: 5000,
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
