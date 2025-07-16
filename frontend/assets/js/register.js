document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const userType = document.getElementById("userType");
    const userProfile = document.getElementById("userProfile");
    const neighborhoodField = document.getElementById("neighborhoodField");
    const cpfCnpjField = document.getElementById("cpfCnpjField");

    userType.addEventListener("change", () => {
        if (userType.value === "COMMON_USER") {
            neighborhoodField.classList.remove("d-none");
            cpfCnpjField.classList.add("d-none");
        } else if (userType.value === "EVENT_OWNER_USER") {
            cpfCnpjField.classList.remove("d-none");
            neighborhoodField.classList.add("d-none");
        } else {
            neighborhoodField.classList.add("d-none");
            cpfCnpjField.classList.add("d-none");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const type = userType.value;
        const profile = userProfile.value;
        const neighborhood = document.getElementById("neighborhood").value.trim();
        const cpfCnpj = document.getElementById("cpfCnpj").value.trim();

        const payload = {
            name, email, password, type, userProfile: profile
        };

        if (type === "COMMON_USER") {
            payload.neighborhood = neighborhood;
            payload.interests = [""];
        } else if (type === "EVENT_OWNER_USER") {
            payload.cpfCnpj = cpfCnpj;
        }

        console.log(payload);

        try {
            if (type === "COMMON_USER") {
                const response = await fetch("http://localhost:8080/api/users/register/common", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                console.log(response);

                const data = await response.json();

                if (!response.ok) {
                    showAlert("danger", response.message || "Erro ao cadastrar usuário.");
                    return;
                }

                showAlert("success", "Cadastro realizado com sucesso! Redirecionando...");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else if (type === "EVENT_OWNER_USER") {
                const response = await fetch("http://localhost:8080/api/users/register/owner", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                console.log(response);

                const data = await response.json();

                if (!response.ok) {
                    showAlert("danger", response.message || "Erro ao cadastrar usuário.");
                    return;
                }

                showAlert("success", "Cadastro realizado com sucesso! Redirecionando...");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            showAlert("danger", "Erro ao conectar com o servidor.");
        }
    });
});

function showAlert(type, message) {
    const alertBox = document.getElementById("alert");
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    alertBox.classList.remove("d-none");
}
