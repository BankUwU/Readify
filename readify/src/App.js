import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Forget from "./routes/forgetpass";
import Home from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Favorite from "./routes/favorites";
import Myreviews from "./routes/myreviews";
function App() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget-password" element={<Forget />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/my-reviews" element={<Myreviews />} />
          </Routes>
        </Router>
      );
}

export default App;
