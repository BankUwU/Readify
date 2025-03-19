import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Home from "./routes/home";
import Login from "./routes/login";
function App() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      );
}

export default App;
