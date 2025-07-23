document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const resultsContainer = document.getElementById("results");
    const loader = document.getElementById("loader");
    const btnSearch = document.getElementById("btnSearch");

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        btnSearch.disabled = true;

        resultsContainer.innerHTML = "";
        loader.classList.remove("d-none");

        const query = document.getElementById("query").value.trim();
        const location = document.getElementById("location").value.trim();
        const dateAfter = document.getElementById("dateAfter").value;
        const spaceType = document.getElementById("spaceType").value;
        const eventType = document.getElementById("type").value;

        const params = new URLSearchParams();

        if (query) params.append("query", query);
        if (location) params.append("location", location);
        if (dateAfter) params.append("dateAfter", dateAfter + "T00:00:00");
        if (spaceType) params.append("spaceType", spaceType);
        if (eventType) params.append("type", eventType);

        const token = localStorage.getItem("token");
        console.log(`parametros da url: ${params.toString()}`);

        try {
            const res = await fetch(`http://localhost:8080/api/events/search?${params.toString()}`);
            const events = await res.json();

            if (events.length === 0) {
                resultsContainer.innerHTML = `<p class="text-muted">Nenhum evento encontrado.</p>`;
            } else {
                events.forEach((event) => {
                    resultsContainer.innerHTML += createEventCard(event);
                });
            }
        } catch (error) {
            resultsContainer.innerHTML = `<div class="alert alert-danger">Erro ao buscar eventos.</div>`;
        } finally {
            loader.classList.add("d-none");
            btnSearch.disabled = false;
        }
    });

    function createEventCard(event) {
        const image = event.imageUrls?.[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWheNqDl8xnOdSWvl8qxsamu_zkAsfMphWHA&s";

        return `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${image}" class="card-img-top" alt="${event.name}">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-champagne-glasses"></i> ${event.name}</h5>
                        <p class="card-text">${event.description.slice(0, 100)}...</p>
                        <p class="mb-1"><i class="fas fa-map-marker-alt me-1"></i>${event.location}</p>
                        <p><i class="far fa-calendar-alt me-1"></i>${formatDate(event.dateHour)}</p>
                        <a href="../../pages/events/eventDetails.html?id=${event.id}" class="btn btn-outline-primary btn-sm">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        `;
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
