document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  const eventsRecommended = document.getElementById("eventsRecommended");
  const carouselInner = document.getElementById("carouselInner");
  const loader = document.getElementById("loader");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent = userName;
  const userTypeInfo = document.getElementById("userTypeInfo");
  const actions = document.getElementById("actionsContainer");
  actions.innerHTML = "";

  if (role === "COMMON_USER") {
    userTypeInfo.textContent = "Você está logado como Usuário Comum.";
    actions.innerHTML = `
          <div class="col-md-4 mb-3">
            <a href="../pages/events/search.html" class="btn btn-outline-primary w-100">Explorar Eventos</a>
          </div>
          <div class="col-md-4 mb-3">
            <a href="../pages/events/myFavorites.html" class="btn btn-outline-success w-100">Meus Interesses</a>
          </div>
        `;

    fetch(`http://localhost:8080/api/events/recommended/${userId}`, {
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
          eventsRecommended.innerHTML = "<p>Você ainda não marcou interesse em nenhum evento.</p>";
          return;
        }

        carouselInner.innerHTML = "";

        const cardsPerSlide = 2;

        for (let i = 0; i < events.length; i += cardsPerSlide) {
          const slide = document.createElement("div");
          slide.className = "carousel-item" + (i === 0 ? " active" : "");

          const row = document.createElement("div");
          row.className = "row justify-content-center";

          for (let j = i; j < i + cardsPerSlide && j < events.length; j++) {
            const event = events[j];

            const col = document.createElement("div");
            col.className = "col-sm-6 col-md-4 mb-3";

            col.innerHTML = `
              <div class="card h-100">
                <img src="${event.imageUrls?.[0] || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="${event.name}">
                <div class="card-body">
                  <h5 class="card-title"><i class="fas fa-champagne-glasses"></i> ${event.name}</h5>
                  <p class="card-text">${event.description.slice(0, 100)}...</p>
                  <p><i class="fas fa-map-marker-alt me-1"></i> ${event.location}</p>
                  <p><i class="far fa-calendar-alt me-1"></i> ${formatDate(event.dateHour)}</p>
                  <a href="../pages/events/eventDetails.html?id=${event.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
                </div>
              </div>
            `;

            row.appendChild(col);
          }

          slide.appendChild(row);
          carouselInner.appendChild(slide);
        }

        new bootstrap.Carousel(document.querySelector('#carouselCards'), {
          interval: false,
          ride: false
        });

        loader.classList.add("d-none");
        eventsRecommended.classList.remove("d-none");
      })
      .catch(err => {
        console.error(err);
        eventsRecommended.innerHTML = "<p>Erro ao carregar eventos favoritos.</p>";
      });
  } else if (role === "EVENT_OWNER_USER") {
    userTypeInfo.textContent = "Você está logado como Dono de Evento.";
    actions.innerHTML = `
          <div class="col-md-4 mb-3">
            <a href="events/create.html" class="btn btn-outline-primary w-100">Criar Evento</a>
          </div>
          <div class="col-md-4 mb-3">
            <a href="events/myEvents.html" class="btn btn-outline-success w-100">Meus Eventos</a>
          </div>
        `;
    loader.classList.add("d-none");
  } else {
    userTypeInfo.textContent = "Tipo de usuário desconhecido.";
    loader.classList.add("d-none");
    eventsRecommended.classList.remove("d-none");
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
