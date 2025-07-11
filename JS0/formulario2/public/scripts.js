document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario");
    const mensaje = document.getElementById("mensaje");
    const userList = document.getElementById("userList");

    const mostrarMensaje = (text, exito = true) => {
        mensaje.textContent = text;
        mensaje.style.color = exito ? "green" : "red";
        setTimeout(() => mensaje.textContent = "", 3000);
    };

    const cargarUsuarios = async () => {
        const res = await fetch("/personas");
        const data = await res.json();

        userList.innerHTML = "";
        data.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.nombre} — Deporte: ${p.deporte}, Herramienta: ${p.herramienta}, Precio: $${p.precio}`;
            userList.appendChild(li);
        });
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const deporte = form.deporte.value.trim();
        const herramienta = form.herramienta.value.trim();
        const precio = form.precio.value.trim();

        if (nombre.length < 3 || !/[A-Za-z]/.test(nombre)) {
            mostrarMensaje("El nombre debe tener al menos 3 letras y contener caracteres válidos.", false);
            return;
        }

        if (deporte.length < 3 || herramienta.length < 3 || isNaN(precio) || precio <= 0) {
            mostrarMensaje("Completá correctamente todos los campos.", false);
            return;
        }

        try {
            const res = await fetch("/enviar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ nombre, deporte, herramienta, precio })
            });

            if (res.ok) {
                mostrarMensaje("Datos guardados correctamente");
                form.reset();
                await cargarUsuarios();
            } else {
                mostrarMensaje("Error al guardar datos", false);
            }
        } catch {
            mostrarMensaje("Error de conexión con el servidor", false);
        }
    });

    cargarUsuarios(); // Cargar al inicio
});
