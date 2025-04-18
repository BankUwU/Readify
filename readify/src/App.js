import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Achievement from "./routes/achievement";
import EditProfile from "./routes/editprofile";
import Favorite from "./routes/favorites";
import Forget from "./routes/forgetpass";
import Home from "./routes/home";
import Login from "./routes/login";
import Myreviews from "./routes/myreviews";
import OTP from "./routes/Otp";
import Register from "./routes/register";
import AddReview from "./routes/addreview";
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
            <Route path="edit-profile" element={<EditProfile/>} />
            <Route path="/achievements" element={<Achievement/>} />
            <Route path="/register/Otp" element={<OTP/>} />
            <Route path="/add-review" element={<AddReview/>} />
          </Routes>
        </Router>
      );
}

export default App;
