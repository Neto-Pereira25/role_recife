document.addEventListener("DOMContentLoaded", async () => {
    const loader = document.getElementById("loader");
    const eventList = document.getElementById("eventList");
    const alertBox = document.getElementById("alert");

    const token = localStorage.getItem("token");

    if (!token) {
        showAlert("danger", "Você precisa estar logado para visualizar seus eventos.");
        return;
    }

    const renderEvents = (events) => {
        eventList.innerHTML = "";

        events.forEach(event => {
            const card = document.createElement("div");
            card.className = "col-md-6";

            const date = new Date(event.dateHour).toLocaleString("pt-BR");

            card.innerHTML = `
                <div class="card shadow rounded-4">
                    <div class="card-body">
                        <h5 class="card-title">${event.name}</h5>
                        <p class="card-text"><strong>Local:</strong> ${event.location}</p>
                        <p class="card-text"><strong>Data:</strong> ${date}</p>
                        <p class="card-text"><strong>Tipo:</strong> ${event.eventType}</p>
                        <p class="card-text"><strong>Capacidade:</strong> ${event.capacity}</p>
                        <div class="d-flex justify-content-end gap-2">
                            <a class="btn btn-outline-secondary btn-sm" href="../../pages/events/eventDetails.html?id=${event.id}">Detalhes</a>
                            <button class="btn btn-outline-primary btn-sm" onclick="editarEvento(${event.id})">Editar</button>
                            <button class="btn btn-outline-danger btn-sm" onclick="excluirEvento(${event.id})">Excluir</button>
                        </div>
                    </div>
                </div>
            `;

            eventList.appendChild(card);
        });

        loader.classList.add("d-none");
        eventList.classList.remove("d-none");
    };

    try {
        // const cached = localStorage.getItem("owner-events");

        // if (cached) {
        //     const savedEvents = JSON.parse(cached);
        //     renderEvents(savedEvents);
        //     return;
        // }

        const response = await fetch("http://localhost:8080/api/events/mine", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(response.message || "Erro ao buscar eventos.");
        }

        const events = await response.json();

        if (events.length === 0) {
            eventList.innerHTML = `<p class="text-muted">Você ainda não criou nenhum evento.</p>`;
            return;
        }

        localStorage.setItem("owner-events", JSON.stringify(events));
        renderEvents(events);
    } catch (error) {
        console.error(error);
        showAlert("danger", error.message);
    }

    function showAlert(type, message) {
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove("d-none");

        setTimeout(() => alertBox.classList.add("d-none"), 4000);
    }
});

// Redirecionar para página de edição
function editarEvento(id) {
    window.location.href = `update.html?id=${id}`;
}

// Exclusão com confirmação
async function excluirEvento(id) {
    const loader = document.getElementById("loader");
    const eventList = document.getElementById("eventList");

    const renderEvents = (events) => {
        eventList.innerHTML = "";

        events.forEach(event => {
            const card = document.createElement("div");
            card.className = "col-md-6";

            const date = new Date(event.dateHour).toLocaleString("pt-BR");

            card.innerHTML = `
                <div class="card shadow rounded-4">
                    <div class="card-body">
                        <h5 class="card-title">${event.name}</h5>
                        <p class="card-text"><strong>Local:</strong> ${event.location}</p>
                        <p class="card-text"><strong>Data:</strong> ${date}</p>
                        <p class="card-text"><strong>Tipo:</strong> ${event.eventType}</p>
                        <p class="card-text"><strong>Capacidade:</strong> ${event.capacity}</p>
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-outline-primary btn-sm" onclick="editarEvento(${event.id})">Editar</button>
                            <button class="btn btn-outline-danger btn-sm" onclick="excluirEvento(${event.id})">Excluir</button>
                        </div>
                    </div>
                </div>
            `;

            eventList.appendChild(card);
        });

        loader.classList.add("d-none");
        eventList.classList.remove("d-none");
    };

    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/api/events/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(response.message || "Erro ao excluir evento.");
        }

        alert("Evento excluído com sucesso!");
    } catch (err) {
        console.error(err);
        alert("Erro ao excluir evento.");
    }

    // Atualização da lista de eventos
    try {

        loader.classList.remove("d-none");
        eventList.classList.add("d-none");

        const storageEventList = localStorage.getItem("owner-events");

        if (storageEventList) {
            localStorage.removeItem("owner-events");
        }

        const response = await fetch("http://localhost:8080/api/events/mine", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(response.message || "Erro ao buscar eventos.");
        }

        const events = await response.json();

        if (events.length === 0) {
            eventList.innerHTML = `<p class="text-muted">Você ainda não criou nenhum evento.</p>`;
            return;
        }

        localStorage.setItem("owner-events", JSON.stringify(events));
        renderEvents(events);
    } catch (error) {
        console.error(error);
        showAlert("danger", error.message);
    }
}
