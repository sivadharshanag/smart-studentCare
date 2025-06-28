import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import FaceScan from "./pages/FaceScan";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard/:studentId" element={<Dashboard />} />  
        <Route path="/home" element={<Home />} />
        <Route path="/signup/uploader" element={<Signup role="uploader" />} />
        <Route path="/signup/retriever" element={<Signup role="retriever" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/uploader" element={<h1>Uploader Dashboard</h1>} />
        <Route path="/retriever" element={<h1>Retriever Dashboard</h1>} />
         <Route path="/scan" element={<FaceScan />} />
      </Routes>
    </Router>
  );
}

export default App;

