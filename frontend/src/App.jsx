import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import StoreCardView from "./pages/StoreCardView";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import DonorPage from "./pages/DonorPage";
import ExpensePage from "./pages/ExpensePage";
import DonationPage from "./pages/DonationPage";
import ExpensesPage from "./pages/ExpensesPage";
import FinancePage from "./pages/FinancePage";

function App() {
  return (
    <>
      <Box minH="100vh" bg={useColorModeValue("gray.200", "gray.500")}>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cards" element={<StoreCardView />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/donors/:id" element={<DonorPage />} />
          <Route path="/categories/:id" element={<ExpensePage />} />
          <Route path="/donations" element={<DonationPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/finance" element={<FinancePage />} />

          {/* Private Routes */}

          {/* <Route
            path="/my-books"
            element={
              <PrivateRoute>
                <UserBooks />
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </Box>
      <Footer />
    </>
  );
}

export default App;
