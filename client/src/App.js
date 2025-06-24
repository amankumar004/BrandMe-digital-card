import "./App.css";
import {Toaster} from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PublicCard from "./pages/PublicCard";
import EditProfile from "./pages/EditProfile";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/resetPassword";


function App() {
  return (
    <>
      <Toaster position="top-center"/>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/card/:username" element={<PublicCard/>} />
        </Routes>
    </Router>
    </>
  );
}

export default App;
