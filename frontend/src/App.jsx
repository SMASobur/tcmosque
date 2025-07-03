import { Box, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
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
import ExpensesDetailsPage from "./pages/ExpensesDeteailsPage";
import GalleryPage from "./pages/GalleryPage";

function App() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <>
      <Box
        minH="100vh"
        bg={useColorModeValue("gray.200", "gray.500")}
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <Navbar />
        <Box flex="1">
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
            <Route path="/expenses-details" element={<ExpensesDetailsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />

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

        <Box pb={isMobile ? "70px" : "0"}>
          <Footer />
        </Box>
      </Box>
      {isMobile && (
        <Box position="fixed" bottom="0" left="0" right="0" zIndex="sticky">
          <BottomNav />
        </Box>
      )}
    </>
  );
}

export default App;
