/** @format */

// Import Routes and Route from react-router-dom to setup routing
import { Routes, Route } from "react-router-dom";

// Public routes wrapping layout
import AuthLayout from "./pages/_auth/AuthLayout";

// Private routes wrapping layout
import RootLayout from "./pages/_root/RootLayout";

// Auth related forms
import SignupFrom from "./pages/_auth/forms/SignupFrom";
import LoginFrom from "./pages/_auth/forms/LoginForm";

// Private pages
import { TweetDetails, Home, ProfilePage } from "./pages/_root/root-pages";
import FourOFour from "./pages/FourOFour";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path='/sign-up' element={<SignupFrom />} />
        <Route path='/log-in' element={<LoginFrom />} />
      </Route>

      {/* Private Routes */}
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='/profile/:id' element={<ProfilePage />} />
        <Route path='/tweet/:id' element={<TweetDetails />} />
      </Route>

      <Route path='/*' element={<FourOFour />} />
    </Routes>
  );
};

export default App;
