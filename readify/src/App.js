import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Favorite from "./routes/favorites";
import Forget from "./routes/forgetpass";
import Home from "./routes/home";
import Login from "./routes/login";
import Myreviews from "./routes/myreviews";
<<<<<<< HEAD
import EditProfile from "./routes/editprofile"
=======
import OTP from "./routes/Otp";
import Register from "./routes/register";
>>>>>>> 6ac74835f1c99295e69feaf33f896d62561b3185
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
<<<<<<< HEAD
            <Route path="edit-profile" element={<EditProfile/>} />
=======
            <Route path="/register/OTP" element={<OTP />} />
>>>>>>> 6ac74835f1c99295e69feaf33f896d62561b3185
          </Routes>
        </Router>
      );
}

export default App;
