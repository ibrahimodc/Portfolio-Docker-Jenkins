import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";
import Dossier from "./components/Dossier";
import Accueil from "./components/Accueil";
import Contact from "./components/Contact";
import APropos from "./components/APropos";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-inner">
            <Link to="/" className="logo">
              <svg
                className="logo-shield"
                width="38"
                height="38"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 3 L33 9 L33 20 C33 27 26 32 18 34 C10 32 3 27 3 20 L3 9 Z"
                  fill="#e0f2fe"
                  stroke="#0369a1"
                  strokeWidth="1.5"
                />
                <path
                  d="M18 3 L33 9 L33 20 C33 27 26 32 18 34 C10 32 3 27 3 20 L3 9 Z"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
                <text
                  x="18"
                  y="22"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="500"
                  fill="#0f172a"
                  fontFamily="system-ui,sans-serif"
                >
                  ID
                </text>
              </svg>
              <div className="logo-info">
                <span className="logo-text">Ibrahima Diallo</span>
                <span className="logo-sub">Cloud · DevSecOps</span>
              </div>
            </Link>

            <div className="header-nav">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Accueil
              </NavLink>
              <NavLink
                to="/projets"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Projets
              </NavLink>
              <NavLink
                to="/apropos"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                À propos
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/projets" element={<Dossier />} />
            <Route path="/projets/:id" element={<Dossier />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apropos" element={<APropos />} />
            <Route path="*" element={<Accueil />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <span>
            © 2026 Ibrahima Diallo · aspirant Cloud &amp; DevSecOps Engineer ·
            Dakar, Sénégal
          </span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
