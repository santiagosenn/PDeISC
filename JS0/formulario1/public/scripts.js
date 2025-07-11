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
            li.textContent = p.usr;
            userList.appendChild(li);
        });
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usr = document.getElementById("usr").value.trim();
        const pass = document.getElementById("pass").value.trim();
        const letraRegex = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/;

        if (usr.length < 3 || !letraRegex.test(usr)) {
            mostrarMensaje("El nombre debe tener al menos 3 caracteres y contener una letra.", false);
            return;
        }

        if (pass.length < 4) {
            mostrarMensaje("La contraseña debe tener al menos 4 caracteres.", false);
            return;
        }

        try {
            const res = await fetch("/enviar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `usr=${encodeURIComponent(usr)}&pass=${encodeURIComponent(pass)}`
            });

            if (res.ok) {
                mostrarMensaje("Usuario agregado correctamente");
                form.reset();
                await cargarUsuarios();
            } else {
                mostrarMensaje("Error al guardar usuario", false);
            }
        } catch (err) {
            mostrarMensaje("Fallo de conexión con el servidor", false);
        }
    });

    cargarUsuarios(); 
});
