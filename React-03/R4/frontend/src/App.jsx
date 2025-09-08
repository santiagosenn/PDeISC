import { useEffect } from "react";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experiences from "./components/Experiences";
import Achievements from "./components/Achievements";

import "./App.css"; // para estilos generales

// Hook para animación al hacer scroll
function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}

export default function App() {
  useScrollAnimation();

  return (
    <div className="App">
      {/* Navbar fijo */}
      <nav className="navbar">
        <ul>
          <li><a href="#about">Sobre mí</a></li>
          <li><a href="#skills">Habilidades</a></li>
          <li><a href="#projects">Proyectos</a></li>
          <li><a href="#experiences">Experiencias</a></li>
          <li><a href="#achievements">Logros</a></li>
        </ul>
      </nav>

      <main>
        <section id="about" className="fade-in"><About /></section>
        <section id="skills" className="fade-in"><Skills /></section>
        <section id="projects" className="fade-in"><Projects /></section>
        <section id="experiences" className="fade-in"><Experiences /></section>
        <section id="achievements" className="fade-in"><Achievements /></section>
      </main>

      <footer>
        <p>© 2025 - Mi Portfolio</p>
      </footer>
    </div>
  );
}
