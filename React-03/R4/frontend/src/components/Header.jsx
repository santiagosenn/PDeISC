export default function Header() {
  return (
    <header style={{ padding: "20px", textAlign: "center", background: "#222", color: "white" }}>
      <h1>Mi Portfolio</h1>
      <nav>
        <a href="#about" style={{ margin: "0 10px", color: "white" }}>Sobre mí</a>
        <a href="#skills" style={{ margin: "0 10px", color: "white" }}>Habilidades</a>
        <a href="#projects" style={{ margin: "0 10px", color: "white" }}>Proyectos</a>
      </nav>
    </header>
  );
}