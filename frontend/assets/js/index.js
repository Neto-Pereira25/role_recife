document.addEventListener("DOMContentLoaded", async () => {
    const loader = document.getElementById("loader");
    const eventList = document.getElementById("eventList");

    const renderEvents = (events) => {
        eventList.innerHTML = "";

        events.forEach(event => {
            const card = document.createElement("div");
            card.className = "col-md-6";

            const date = new Date(event.dateHour).toLocaleString("pt-BR");

            card.innerHTML = `
                <div class="card h-100">
                    <img src="${event.imageUrls?.[0] || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="${event.name}">
                    <div class="card-body">
                    <h5 class="card-title"><i class="fas fa-champagne-glasses"></i> ${event.name}</h5>
                    <p class="card-text">${event.description.slice(0, 100)}...</p>
                    <p class="text-muted mb-1"><i class="fas fa-map-marker-alt me-1"></i>${event.location}</p>
                    <p class="text-muted"><i class="far fa-calendar-alt me-1"></i>${formatDate(event.dateHour)}</p>
                    <a href="./assets/pages/events/eventDetails.html?id=${event.id}" class="btn btn-outline-primary btn-sm">Ver Detalhes</a>
                    </div>
                </div>
            `;

            eventList.appendChild(card);
        });

        loader.classList.add("d-none");
        eventList.classList.remove("d-none");
    };

    try {
        const response = await fetch("http://localhost:8080/api/events");

        if (!response.ok) {
            console.log(response);
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
    }

    function formatDate(dateTimeStr) {
        const date = new Date(dateTimeStr);
        return date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
});