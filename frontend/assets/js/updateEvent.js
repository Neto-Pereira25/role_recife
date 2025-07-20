document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editEventForm");
    const attractionsContainer = document.getElementById("attractionsContainer");
    const imagesContainer = document.getElementById("imagesContainer");

    const addAttractionBtn = document.getElementById("addAttractionBtn");
    const addImageBtn = document.getElementById("addImageBtn");
    const alertBox = document.getElementById("alert");

    const eventId = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("token");

    const editEventBtn = document.getElementById("editEventBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    if (!eventId || !token) {
        showAlert("danger", "ID do evento ou token inválido.");
        return;
    }

    // Função para mostrar alertas
    function showAlert(type, message) {
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove("d-none");
        setTimeout(() => alertBox.classList.add("d-none"), 5000);
    }

    // Carregar evento
    async function loadEvent() {
        try {
            const res = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Erro ao buscar evento");

            const event = await res.json();
            fillForm(event);
        } catch (err) {
            showAlert("danger", "Erro ao carregar evento.");
            console.error(err);
        }
    }

    // Preenche o formulário com os dados
    function fillForm(event) {
        document.getElementById("name").value = event.name || "";
        document.getElementById("location").value = event.location || "";
        document.getElementById("dateHour").value = event.dateHour?.slice(0, 16) || "";
        document.getElementById("capacity").value = event.capacity || "";
        document.getElementById("ageGroup").value = event.ageGroup || "";
        document.getElementById("spaceType").value = event.spaceType || "";
        document.getElementById("periodicity").value = event.periodicity || "";
        document.getElementById("eventType").value = event.eventType || "";
        document.getElementById("description").value = event.description || "";
        document.getElementById("ticketLink").value = event.ticketLink || "";
        document.getElementById("tags").value = (event.tags || []).join(", ");

        // Imagens
        (event.imageUrls || []).forEach((url) => addImageField(url));

        // Atrações
        (event.attractions || []).forEach((attraction) => {
            addAttractionField(attraction);
        });
    }

    // Adiciona campos de imagem
    function addImageField(url = "") {
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("row", "g-2", "mb-2");

        imageDiv.innerHTML = `
            <div class="col-md-11">
                <input type="url" class="form-control" placeholder="URL da imagem" name="imageUrl" value="${url}" required>
            </div>
            <div class="col-md-1 text-end">
                <button type="button" class="btn btn-danger btn-sm remove-btn">&times;</button>
            </div>
        `;

        imageDiv.querySelector(".remove-btn").addEventListener("click", () => {
            imagesContainer.removeChild(imageDiv);
        });

        imagesContainer.appendChild(imageDiv);
    }

    // Adiciona campos de atração
    function addAttractionField(name = "") {
        const attractionDiv = document.createElement("div");
        attractionDiv.classList.add("row", "g-2", "mb-2");

        attractionDiv.innerHTML = `
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Nome da atração" name="attractionName" value="${name}" required>
            </div>
            <div class="col-md-1 text-end">
                <button type="button" class="btn btn-danger btn-sm remove-btn">&times;</button>
            </div>
        `;

        attractionDiv.querySelector(".remove-btn").addEventListener("click", () => {
            attractionsContainer.removeChild(attractionDiv);
        });

        attractionsContainer.appendChild(attractionDiv);
    }

    // Botão para adicionar nova imagem
    addImageBtn.addEventListener("click", () => addImageField());

    // Botão para adicionar nova atração
    addAttractionBtn.addEventListener("click", () => addAttractionField());

    // Envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        editEventBtn.disabled = true;

        const payload = {
            name: document.getElementById("name").value,
            location: document.getElementById("location").value,
            dateTime: document.getElementById("dateHour").value,
            capacity: parseInt(document.getElementById("capacity").value),
            ageRating: document.getElementById("ageGroup").value,
            spaceType: document.getElementById("spaceType").value,
            periodicity: document.getElementById("periodicity").value,
            eventType: document.getElementById("eventType").value,
            description: document.getElementById("description").value,
            ticketLink: document.getElementById("ticketLink").value || null,
            tags: document.getElementById("tags").value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            imageUrls: [],
            attractions: [],
        };

        document.querySelectorAll("input[name='imageUrl']").forEach((input) => {
            if (input.value.trim()) {
                payload.imageUrls.push(input.value.trim());
            }
        });

        const nameInputs = document.querySelectorAll("input[name='attractionName']");

        for (let i = 0; i < nameInputs.length; i++) {
            if (nameInputs[i].value.trim()) {
                payload.attractions.push(nameInputs[i].value.trim());
            }
        }

        try {
            cancelBtn.classList.add("disabled");

            const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json();
                showAlert("danger", errData.message || "Erro ao atualizar evento.");
                return;
            }

            showAlert("success", "Evento atualizado com sucesso!");
            setTimeout(() => {
                window.location.href = "myEvents.html";
            }, 1500);
        } catch (error) {
            console.error(error);
            showAlert("danger", "Erro ao enviar dados.");
        } finally {
            cancelBtn.classList.remove("disabled");
            editEventBtn.disabled = false;
        }
    });

    // Inicializar
    loadEvent();
});
