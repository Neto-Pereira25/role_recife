// assets/js/auth.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showAlert("danger", response.message || "Erro ao fazer login.");
                return;
            }

            // Armazena o token no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.userType);
            localStorage.setItem("userName", data.userName);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("user", JSON.stringify(data));

            // Redireciona com base na role
            if (data.userType === "EVENT_OWNER_USER") {
                window.location.href = "dashboard.html";
            } else if (data.userType === "COMMON_USER") {
                window.location.href = "dashboard.html"; // Pode mudar para outra página se desejar
            }

        } catch (err) {
            console.error(err);
            showAlert("danger", "Erro na conexão com o servidor.");
        }
    });
});

// Função para mostrar alertas
function showAlert(type, message) {
    const alertBox = document.getElementById("alert");
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    alertBox.classList.remove("d-none");
}
