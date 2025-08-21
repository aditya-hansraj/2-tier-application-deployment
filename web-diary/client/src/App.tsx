import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/SIgnUp";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/theme.context.tsx";
import { useAuth } from "./contexts/auth.context.tsx";
import Footer from "./components/Footer.tsx";
import NotFound from "./pages/NotFound.tsx";
import DiaryEntries from "./pages/DiaryEntries";
import EntryDetails from "./pages/EntryDetails";
import { EntryProvider } from "./contexts/entry.context.tsx";
import AddEntry from "./pages/AddEntry.tsx";
import EditEntry from "./pages/EditEntry.tsx";
import Profile from "./pages/Profile.tsx";
import RecentActivities from "./pages/RecentActivities.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <ThemeProvider>
      <BrowserRouter>
        <EntryProvider>
          <div className="main-content">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
              />
              <Route
                path="/diaries"
                element={
                  // isAuthenticated ?
                  <DiaryEntries />
                  // : <Navigate to="/" />
                }
              />
              <Route
                path="/addentry"
                element={isAuthenticated ? <AddEntry /> : <Navigate to="/" />}
              />
              <Route path="/entries/:id" element={<EntryDetails />} />
              <Route path="/entries/:id/edit" element={<EditEntry />} />
              <Route path="/me" element={ isAuthenticated ? <Profile /> : <Login /> } />
              <Route path="/me/activities" element={ isAuthenticated ? <RecentActivities /> : <Login />} />
              <Route path="/me/change-password" element={ isAuthenticated ? <ChangePassword /> : <Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </EntryProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
