import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Pillars from "./pages/Pillars";
import PillarDetail from "./pages/PillarDetail";
import Membership from "./pages/Membership";
import Chapters from "./pages/Chapters";
import Governance from "./pages/Governance";
import Programs from "./pages/Programs";
import Apply from "./pages/Apply";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Research from "./pages/Research";
import ResearchDetail from "./pages/ResearchDetail";
import NationProfile from "./pages/NationProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen"><Outlet /></main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/pillars" element={<Pillars />} />
                <Route path="/pillars/:slug" element={<PillarDetail />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/chapters" element={<Chapters />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/research" element={<Research />} />
                <Route path="/research/:slug" element={<ResearchDetail />} />
                <Route path="/nation/:slug" element={<NationProfile />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </HelmetProvider>
    </div>
  );
}

export default App;
