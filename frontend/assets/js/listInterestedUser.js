document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");
    const eventName = urlParams.get("eventName");
    const h2 = document.getElementById("title");

    const loader = document.getElementById("loader");
    const listInterestedUser = document.getElementById("listInterestedUser");

    listInterestedUser.classList.add("p-4");
    h2.innerText = `Lista de Usuários Interessados no Evento ${eventName || ""}`;

    const users = [];

    const renderListInterestedUser = (users) => {
        users.forEach((user, index) => {
            const collapseId = `user-details-${index}`;
            const card = document.createElement("div");
            card.classList.add("mb-3");

            card.innerHTML = `
                <button 
                    class="btn btn-link text-start w-100 text-decoration-none text-reset"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#${collapseId}"
                    aria-expanded="false"
                    aria-controls="${collapseId}"
                >
                    <i class="fas fa-user"></i> ${user.name}
                </button>
                <div class="collapse mt-2" id="${collapseId}">
                    <div class="card card-body">
                        <p>${user.name}</p>
                        <p>${user.email}</p>
                        <p>${user.neighborhood}</p>
                        <p>${user.type}</p>
                        <p>${user.userProfile}</p>
                    </div>
                </div>
            `;
            listInterestedUser.appendChild(card);
        });

        loader.classList.add("d-none");
        listInterestedUser.classList.remove("d-none");
    }

    try {
        const response = await fetch(`http://localhost:8080/api/events/getEventUsers/${eventId}`);

        if (!response.ok) {
            console.log(response);
            throw new Error(response.message || "Erro ao buscar eventos.");
        }

        const data = await response.json();
        data.forEach(u => users.push(u));
        renderListInterestedUser(users);
    } catch (error) {
        console.log("Erro ao buscar usuários:", error);
    }

    console.log(users);

});