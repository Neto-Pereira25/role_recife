const urlParams = new URLSearchParams(window.location.search);
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

const eventId = urlParams.get("id");
const interestBtn = document.getElementById("interestBtn");
const loader = document.getElementById("loader");
const detailsContainer = document.getElementById("detailsContainer");

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
        document.getElementById("eventImage").src = "https://via.placeholder.com/400x250?text=Sem+Imagem";
    }

    loader.classList.add("d-none");
    detailsContainer.classList.remove("d-none");
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
