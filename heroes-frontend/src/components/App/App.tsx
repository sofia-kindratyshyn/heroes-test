import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import css from "./App.module.css";
import HeroesList from "../HeroesList/HeroesList";
import CreateEditHero from "../pages/CreateHero";
import HeroDetails from "../HeroDetails/HeroDetails";

function App() {
  return (
    <Router>
      <div className={css.wrapper}>
        <Sidebar />

        <main>
          <Routes>
            <Route path="/" element={<HeroesList />} />
            <Route path="/create" element={<CreateEditHero />} />
            <Route path="/edit/:id" element={<CreateEditHero />} />
            <Route path="/details/:id" element={<HeroDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
