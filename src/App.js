import "./App.css";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import loader from "./assets/loader2.gif";

function App() {
  const { me, loading, networkError } = useContext(UserContext);

  return (
    <>
      {loading ? (
        <div className="loading-page">
          <img src={loader} alt="Loading..." />
        </div>
      ) : (
        <div className="App">
          {me && !networkError ? (
            <Home />
          ) : !networkError ? (
            <Routes>
              <>
                <Route path="/*" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </>
            </Routes>
          ) : (
            <p>Internet Connection lost. Refresh the page</p>
          )}
        </div>
      )}
    </>
  );
}

export default App;
