document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const container = document.getElementById("favoritesContainer");
    const loader = document.getElementById("loader");

    if (!token) {
        container.innerHTML = "<p>Você precisa estar logado para ver seus eventos favoritos.</p>";
        return;
    }

    fetch(`http://localhost:8080/api/favorites/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao buscar eventos favoritos.");
            return res.json();
        })
        .then(events => {
            if (events.length === 0) {
                container.innerHTML = "<p class='text-center'>Você ainda não marcou interesse em nenhum evento.</p>";
                loader.classList.add("d-none");
                container.classList.remove("d-none");
                return;
            }

            events.forEach(event => {
                const card = document.createElement("div");
                card.className = "col-md-4";
                card.innerHTML = `
                    <div class="card h-100">
                        <img src="${event.imageUrls?.[0] || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="${event.name}">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-champagne-glasses"></i> ${event.name}</h5>
                            <p class="card-text">${event.description.slice(0, 100)}...</p>
                            <p><i class="fas fa-map-marker-alt me-1"></i> ${event.location}</p>
                            <p><i class="far fa-calendar-alt me-1"></i>${formatDate(event.dateHour)}</p>
                            <a href="../events/eventDetails.html?id=${event.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            loader.classList.add("d-none");
            container.classList.remove("d-none");
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = "<p>Erro ao carregar eventos favoritos.</p>";
        });

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
