document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const profile = document.getElementById("profile");
    const loader = document.getElementById("loader");

    if (!token || !user) {
        window.location.href = "../../login.html";
        return;
    }

    // Preenche os campos com os dados disponíveis
    document.getElementById("name").value = user.userName || "Não informado";
    document.getElementById("email").value = user.userEmail || "Não informado";
    document.getElementById("userType").value =
        user.userType === "COMMON_USER" ? "Usuário Comum" : "Dono de Evento";

    // Buscar os interesses, se houver rota backend
    fetch(`http://localhost:8080/api/favorites/${user.userId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
            if (!res.ok) throw new Error("Erro ao carregar interesses");
            return res.json();
        })
        .then((data) => {
            console.log(data);
            if (Array.isArray(data) && data.length > 0) {
                const categorias = data.map((f) => f.name).join(", ");
                document.getElementById("interests").value = categorias;
                loader.classList.add("d-none");
                profile.classList.remove("d-none");
            } else {
                document.getElementById("interests").value = "Nenhum interesse cadastrado";
            }
        })
        .catch((err) => {
            console.error(err);
            document.getElementById("interests").value = "Erro ao carregar";
        });
});
