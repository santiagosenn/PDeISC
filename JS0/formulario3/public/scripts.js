document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("personaForm");
    const mensaje = document.getElementById("mensaje");
    const lista = document.getElementById("listaPersonas");
    const tieneHijos = document.getElementById("tieneHijos");
    const cantidadHijos = document.getElementById("cantidadHijos");
    const labelHijos = document.getElementById("labelHijos");

    tieneHijos.addEventListener("change", () => {
        if (tieneHijos.value === "Sí") {
            cantidadHijos.style.display = "block";
            labelHijos.style.display = "block";
            cantidadHijos.setAttribute("required", "true");
        } else {
            cantidadHijos.style.display = "none";
            labelHijos.style.display = "none";
            cantidadHijos.removeAttribute("required");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = new FormData(form);
        const persona = {};
        datos.forEach((value, key) => persona[key] = value);

        try {
            const res = await fetch("/enviar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(persona)
            });

            if (res.ok) {
                mensaje.textContent = "✅ Persona guardada correctamente.";
                mensaje.style.color = "green";
                form.reset();
                cantidadHijos.style.display = "none";
                labelHijos.style.display = "none";
                cargarPersonas();
            } else {
                mensaje.textContent = "❌ Error al guardar.";
                mensaje.style.color = "red";
            }
        } catch (err) {
            mensaje.textContent = "❌ Error de red.";
            mensaje.style.color = "red";
        }
    });

    async function cargarPersonas() {
        const res = await fetch("/personas");
        const personas = await res.json();
        lista.innerHTML = "";
        personas.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.nombre} ${p.apellido}`;
            lista.appendChild(li);
        });
    }

    cargarPersonas();
});
