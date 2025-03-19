import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Forget from "./routes/forgetpass";
import Home from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
function App() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget-password" element={<Forget />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      );
}

export default App;
