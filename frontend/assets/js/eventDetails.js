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
    try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
        if (!response.ok) throw new Error("Evento não encontrado.");

        const event = await response.json();
        renderEventDetails(event);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar detalhes do evento.");
    }

    document.getElementById("prevImageBtn").addEventListener("click", () => {
        if (imageUrls.length === 0) return;
        imageIndex = (imageIndex - 1 + imageUrls.length) % imageUrls.length;
        document.getElementById("eventImage").src = imageUrls[imageIndex];
    });

    document.getElementById("nextImageBtn").addEventListener("click", () => {
        if (imageUrls.length === 0) return;
        imageIndex = (imageIndex + 1) % imageUrls.length;
        document.getElementById("eventImage").src = imageUrls[imageIndex];
    });

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
                        goBackBtn.classList.add("disabled");
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

function renderEventDetails(event) {
    document.getElementById("eventName").textContent = event.name;
    document.getElementById("eventLocation").textContent = event.location;
    document.getElementById("eventDate").textContent = formatDate(event.dateHour);
    document.getElementById("eventCapacity").textContent = event.capacity;
    document.getElementById("eventAgeGroup").textContent = event.ageGroup;
    document.getElementById("eventSpaceType").textContent = formatEnum(event.spaceType);
    document.getElementById("eventPeriodicity").textContent = formatEnum(event.periodicity);
    document.getElementById("eventType").textContent = formatEnum(event.eventType);
    document.getElementById("eventDescription").textContent = event.description;

    // Link de ingresso
    if (event.ticketLink) {
        document.getElementById("eventTicketLink").href = event.ticketLink;
        document.getElementById("eventLinkContainer").style.display = "block";
    }

    // Tags
    // document.getElementById("eventTags").textContent = (event.tags || []).join(", ");
    const tagsContainer = document.getElementById("eventTags");
    (event.tags || []).forEach((tag) => {
        const span = document.createElement("span");
        span.className = "badge bg-secondary me-1";
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // Atrações
    const attractionList = document.getElementById("eventAttractions");
    attractionList.innerHTML = "";
    (event.attractions || []).forEach((a) => {
        const li = document.createElement("li");
        li.textContent = `${a}`;
        attractionList.appendChild(li);
    });

    // Imagens
    imageUrls = event.imageUrls || [];
    if (imageUrls.length > 0) {
        imageIndex = 0;
        document.getElementById("eventImage").src = imageUrls[0];
    } else {
        document.getElementById("eventImage").src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWheNqDl8xnOdSWvl8qxsamu_zkAsfMphWHA&s";
    }

    loader.classList.add("d-none");
    detailsContainer.classList.remove("d-none");
    detailsContainer.classList.add("d-flex");
    detailsContainer.classList.add("flex-column");
    detailsContainer.classList.add("align-items-center");
    detailsContainer.classList.add("justify-content-center");
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
