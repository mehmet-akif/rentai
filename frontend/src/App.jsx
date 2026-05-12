import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitListingPage from "./pages/SubmitListingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SavedPage from "./pages/SavedPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<PropertyDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/submit-listing" element={<SubmitListingPage />} />
        <Route path="/saved" element={<SavedPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;