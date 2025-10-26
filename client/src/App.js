import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UploadResume from './components/Uploadresume';
import Resumedisplay from "./components/Resumedisplay";
import Interview from "./pages/Interview";
import Analysis from "./pages/Analysis";
// Upload and Retrieve are now sections on Home page
// import Upload from "./pages/Upload";
// import Retrieve from "./pages/Retrieve";

import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";
import Start from "./components/Start";


function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navigation />
        <div className="main-content">
          <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
           <Route path="/uploadresume" element={<UploadResume />} />
          <Route path="/home" element={<Home />} />
          <Route path="/resume-display" element={<Resumedisplay />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/signup/uploader" element={<Signup role="uploader" />} />
          <Route path="/signup/retriever" element={<Signup role="retriever" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/start" element={<Start />} />
          {/* Upload and Retrieve are now sections on Home page */}
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

