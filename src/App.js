import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DestinationPage from "./pages/DestinationPage";
import PackageDetails from "./pages/PackageDetails";
import NewDestinationsPage from "./pages/NewDestinationsPage";
import "./App.css";


function App() {
  return (
    <Router>

      

        <Routes>
   <Route path="/" element={<NewDestinationsPage />} />
   <Route path="/destinations" element={<DestinationPage />} />
   <Route path="/new-destinations" element={<NewDestinationsPage />} />
   <Route path="/destinations" element={<DestinationPage/>} />
   <Route path="/package/:id" element={<PackageDetails/>} />
   </Routes> 
      

    </Router>
  );
}

export default App;