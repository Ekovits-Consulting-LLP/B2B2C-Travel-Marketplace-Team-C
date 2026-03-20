import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Deals from "./pages/Deals";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>

      <Footer />

    </Router>
  );
}

export default App;