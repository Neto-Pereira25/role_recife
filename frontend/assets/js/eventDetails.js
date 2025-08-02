const urlParams = new URLSearchParams(window.location.search);
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

const eventId = urlParams.get("id");
const interestBtn = document.getElementById("interestBtn");
const goBackBtn = document.getElementById("goBackBtn");
const loader = document.getElementById("loader");
const loaderRecommendedEvents = document.getElementById("loaderRecommendedEvents");
const detailsContainer = document.getElementById("detailsContainer");

const eventsRecommended = document.getElementById("eventsRecommended");
const carouselInner = document.getElementById("carouselInner");

interestBtn.disabled = true;

let imageIndex = 0;
let imageUrls = [];

document.addEventListener("DOMContentLoaded", async () => {

    document.getElementById("reserveButton").disabled = true;

    try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
        if (!response.ok) throw new Error("Evento não encontrado.");

        const event = await response.json();
        renderEvent(event);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar detalhes do evento.");
    }

    if (token && role === "COMMON_USER") {
        interestBtn.classList.remove("d-none");

        try {
            const res = await fetch(`http://localhost:8080/api/favorites/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const erroBody = await res.json();
                console.log(erroBody);
                throw new Error(erroBody.message);
            }

            const eventsResponse = await res.json();

            const filteredEvent = eventsResponse.filter(e => e.id === Number(eventId));

            if (filteredEvent.length !== 0) {
                interestBtn.disabled = true;
            } else {
                interestBtn.disabled = false;

                interestBtn.addEventListener('click', async () => {
                    try {
                        const response = await fetch(`http://localhost:8080/api/favorites/${userId}/${eventId}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (!response.ok) {
                            const erroBody = await response.json();
                            // console.log(response);
                            console.log(erroBody);
                            throw new Error(erroBody.message);
                        }

                        interestBtn.innerHTML = `<i class="fa-solid fa-heart me-2"></i>Interesse Registrado`;
                        interestBtn.classList.remove("btn-outline-primary");
                        interestBtn.classList.add("btn-success");
                        interestBtn.disabled = true;
                        // goBackBtn.classList.add("disabled");
                    } catch (error) {
                        interestBtn.innerHTML = `<i class="fa-solid fa-heart me-2"></i>${error.message}`;
                        interestBtn.classList.remove("btn-outline-primary");
                        interestBtn.classList.add("btn-danger");
                        interestBtn.disabled = true;
                        console.error(error);
                        console.error(error.message);
                    }
                });
            }

        } catch (error) {
            console.error("Erro ao buscar eventos favoritos do usuário");
            console.error(error);
            console.error(error.message);
        }
    }

    // Renderizar os eventos relacionados
    try {
        const getRecommendedEvent = await fetch(`http://localhost:8080/api/events/recommendedByEvent/${eventId}`);

        if (!getRecommendedEvent.ok) {
            console.log("Deu ERRO ao buscar eventos relacionados");
            console.log(getRecommendedEvent);
            return;
        }

        const recommendedEventsByEventTagas = await getRecommendedEvent.json();

        if (recommendedEventsByEventTagas.length === 0) {
            eventsRecommended.innerHTML = "<p class='mt-3 text-center'>Não há nenhum evento para recomendar no momento!</p>";
            eventsRecommended.classList.remove("d-none");
            loaderRecommendedEvents.classList.add("d-none");
            return;
        }

        eventsRecommended.classList.remove("d-none");
        loaderRecommendedEvents.classList.add("d-none");

        carouselInner.innerHTML = "";

        const cardsPerSlide = 3;

        for (let i = 0; i < recommendedEventsByEventTagas.length; i += cardsPerSlide) {
            const slide = document.createElement("div");
            slide.className = "carousel-item" + (i === 0 ? " active" : "");

            const row = document.createElement("div");
            row.className = "row justify-content-center";

            for (let j = i; j < i + cardsPerSlide && j < recommendedEventsByEventTagas.length; j++) {
                const event = recommendedEventsByEventTagas[j];

                const col = document.createElement("div");
                col.className = "col-sm-6 col-md-4 mb-3";

                col.innerHTML = `
                    <div class="card h-100">
                        <img src="${event.images?.[0].url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWheNqDl8xnOdSWvl8qxsamu_zkAsfMphWHA&s'}" class="card-img-top" alt="${event.name}">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-champagne-glasses"></i> ${event.name}</h5>
                            <p class="card-text">${event.description.slice(0, 100)}...</p>
                            <p><i class="fas fa-map-marker-alt me-1"></i> ${event.location}</p>
                            <p><i class="far fa-calendar-alt me-1"></i> ${formatDate(event.dateHour)}</p>
                            <a href="./eventDetails.html?id=${event.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
                        </div>
                    </div>
                `;

                row.appendChild(col);
            }

            slide.appendChild(row);
            carouselInner.appendChild(slide);
        }

        new bootstrap.Carousel(document.querySelector("#carouselCards"), {
            interval: false,
            ride: false
        });


    } catch (error) {
        console.error(error);
        alert("Erro ao carregar eventos relacionados.");
    }
});

async function renderEvent(event) {
    const container = document.getElementById("event-container");

    const sectionHeader = document.createElement("section");
    sectionHeader.innerHTML = `
        <section class="bg-gradient-festa text-white text-center py-5">
            <div class="container">
                <h1 class="display-4 fw-bold">${event.name}</h1>
                <p class="lead">${event.description}</p>
                <div class="d-flex flex-wrap justify-content-center gap-3 my-4">
                <span class="badge bg-light text-dark fs-6"><i class="bi bi-calendar-event"></i> ${formatDate(event.dateHour)}</span>
                <span class="badge bg-light text-dark fs-6"><i class="bi bi-clock"></i> ${formatTime(event.dateHour)}</span>
                <span class="badge bg-light text-dark fs-6"><i class="bi bi-people"></i> Até ${event.capacity} pessoas</span>
                </div>
                <a href="${event.ticketLink}" target="_blank" class="btn btn-light btn-lg shadow-festa">
                Comprar Ingressos
                </a>
            </div>
        </section>
    `;

    const sectionPhotos = document.createElement("section");
    sectionPhotos.innerHTML = `
        <section class="container my-5">
            <h2 class="text-center mb-4"><i class="bi bi-image text-primary mx-2"></i>Fotos do Evento</h2>
            <div id="carouselImages" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                ${event.imageUrls.map((img, idx) => `
                    <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                    <img src="${img}" class="d-block w-100 rounded" alt="Imagem ${idx + 1}">
                    </div>`).join("")}
                </div>
                <button class="carousel-control-prev bg-dark" type="button" data-bs-target="#carouselImages" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next bg-dark" type="button" data-bs-target="#carouselImages" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
                </button>
            </div>
        </section>
    `;

    const sectionInfo = document.createElement("section");
    sectionInfo.innerHTML = `
        <section class="container my-5">
            <div class="row g-4">
                <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                    <h4 class="card-title"><i class="bi bi-geo-alt-fill text-primary"></i> Detalhes do Evento</h4>
                    <p><strong>Local:</strong> ${event.location}</p>
                    <p><strong>Classificação:</strong> +${event.ageGroup} anos</p>
                    <p><strong>Tipo:</strong> ${getEventTypeLabel(event.eventType)}</p>
                    <p><strong>Espaço:</strong> ${getSpaceTypeLabel(event.spaceType)}</p>
                    <p><strong>Organizador:</strong> ${event.ownerName}</p>
                    </div>
                </div>
                </div>
                <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                    <h4 class="card-title"><i class="bi bi-music-note-beamed text-primary"></i> Atrações</h4>
                    <ul class="list-group list-group-flush">
                        ${event.attractions.map(attr => `<li class="list-group-item">${attr}</li>`).join("")}
                    </ul>
                    </div>
                </div>
                </div>
            </div>
        </section>
    `;

    const sectionTags = document.createElement("section");
    sectionTags.innerHTML = `
        <section class="container my-5">
            <h4 class="text-center mb-3"><i class="bi bi-tags text-primary mx-2"></i>Tags do Evento</h4>
            <div class="d-flex flex-wrap justify-content-center gap-2">
                ${event.tags.map(tag => `<span class="badge border border-primary text-primary px-3 py-2">${tag}</span>`).join("")}
            </div>
        </section>
    `;

    const sectionPeople = document.createElement("section");
    sectionPeople.innerHTML = `
        ${event.reservations.length ? `
        <section class="container my-5">
            <h4 class="text-center mb-4"><i class="bi bi-people-fill text-primary"></i> Pessoas Confirmadas (${event.reservations.length})</h4>
            <div class="row g-3">
                ${event.reservations.map(r => `
                <div class="col-sm-6 col-md-4">
                    <div class="d-flex align-items-center p-3 bg-white rounded shadow-sm">
                    <div class="bg-gradient-festa text-white rounded-circle d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
                        ${r.user.name.charAt(0)}
                    </div>
                    <div class="ms-3">
                        <strong>${r.user.name}</strong>
                        <div class="text-muted small">${r.user.neighborhood}</div>
                    </div>
                    </div>
                </div>`).join("")}
            </div>
        </section>` : ""}
    `;

    container.prepend(sectionPeople);
    container.prepend(sectionTags);
    container.prepend(sectionInfo);
    container.prepend(sectionPhotos);
    container.prepend(sectionHeader);

    if (token && role === "COMMON_USER") {

        try {
            const response = await fetch(`http://localhost:8080/api/reservations/user/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                console.log("Error")
                console.log(response);
                throw response;
            }

            const listReservation = await response.json();
            const reservation = listReservation.filter(r => r.eventId === Number(eventId));

            if (reservation.length === 1) {
                console.log("Você já reservou esse evento fofinho!");
                document.getElementById("reserveButton").disabled = true;
                document.getElementById("reserveButton").textContent = "Você já reservou uma vaga para esse evento";
                document.getElementById("reserveButton").classList.add("bg-danger");
            } else {
                document.getElementById("reserveButton").disabled = false;
            }
        } catch (error) {
            console.log("Erro ao encontrar os eventos que o usuário tem reserva.");
            console.log(error);
        }

        if (event.allowReservation) {
            document.getElementById("reservationSection").classList.remove("d-none");
            document.getElementById("filledSpots").textContent = event.reservations.length;
            document.getElementById("totalEventCapacity").textContent = event.capacity;
            if (event.reservations.length >= event.capacity) {
                document.getElementById("reserveButton").disabled = true;
                document.getElementById("reserveButton").textContent = "Vagas esgotadas";
                document.getElementById("reserveButton").classList.add("bg-danger");
            }
        }

        console.log("Evento que vai ser reenderizado:", event);

        document.getElementById("reserveButton").addEventListener("click", async (event) => {
            document.getElementById("reserveButton").disabled = true;
            try {
                const response = await fetch(`http://localhost:8080/api/reservations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        eventId: eventId,
                        userId: userId
                    }),
                });

                if (!response.ok) {
                    console.log(response);
                    throw new Error("Erro ao reservar vaga");
                }

                document.getElementById("reservationMessage").textContent = "Reserva realizada com sucesso!";
                document.getElementById("reservationMessage").classList.remove("d-none");

                const filled = parseInt(document.getElementById("filledSpots").textContent);
                document.getElementById("filledSpots").textContent = filled + 1;

                if (filled + 1 >= event.capacity) {
                    document.getElementById("reserveButton").disabled = true;
                    document.getElementById("reserveButton").textContent = "Vagas esgotadas";
                }

                window.location.reload();
            } catch (error) {
                console.log("Erro inesperado ao tentar reservar vaga");
                console.log(error);
            }
        });
    }

    loader.classList.add("d-none");
}

function formatDate(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function formatEnum(value) {
    if (!value) return "";
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    }).format(date);
}

function formatTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getEventTypeLabel(type) {
    return type === "PAID_EVENT" ? "Evento Pago" : "Evento Gratuito";
}

function getSpaceTypeLabel(type) {
    return type === "OPEN" ? "Espaço Aberto" : "Espaço Fechado";
}
