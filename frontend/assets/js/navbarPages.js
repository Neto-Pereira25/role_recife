document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.createElement("div");
    fetch("./navbarPages.html")
        .then(res => res.text())
        .then(html => {
            navbarContainer.innerHTML = html;
            document.body.prepend(navbarContainer);

            const token = localStorage.getItem("token");
            const user = localStorage.getItem("userName");
            const userType = localStorage.getItem("role");

            if (token && user) {
                // Mostrar elementos de usuário logado
                document.getElementById("logoutBtn").classList.remove("d-none");
                document.getElementById("userWelcome").classList.remove("d-none");
                document.getElementById("userNameDisplay").textContent = `Olá, ${user}`;
                document.getElementById("loginBtn").classList.add("d-none");
                document.getElementById("registerBtn").classList.add("d-none");
                document.getElementById("dashboardLink").classList.remove("d-none");

                // Mostrar links de dono de evento
                if (userType === "EVENT_OWNER_USER") {
                    document.getElementById("myEventsLink").classList.remove("d-none");
                }
            }
        });

    window.logout = function () {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        window.location.href = "./index.html";
    };
});
