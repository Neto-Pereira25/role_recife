document.addEventListener("DOMContentLoaded", () => {
    const createEventForm = document.getElementById("createEventForm");
    const attractionsContainer = document.getElementById("attractionsContainer");
    const imagesContainer = document.getElementById("imagesContainer");

    const addAttractionBtn = document.getElementById("addAttractionBtn");
    const addImageBtn = document.getElementById("addImageBtn");

    // Botão para adicionar uma nova atração
    addAttractionBtn.addEventListener("click", () => {
        const attractionDiv = document.createElement("div");
        attractionDiv.classList.add("row", "g-2", "mb-2");

        attractionDiv.innerHTML = `
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Nome da atração" name="attractionName" required>
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Tipo da atração" name="attractionType" required>
            </div>
            <div class="col-md-1 text-end">
                <button type="button" class="btn btn-danger btn-sm remove-btn">&times;</button>
            </div>
        `;

        attractionDiv.querySelector(".remove-btn").addEventListener("click", () => {
            attractionsContainer.removeChild(attractionDiv);
        });

        attractionsContainer.appendChild(attractionDiv);
    });

    // Botão para adicionar uma nova imagem
    addImageBtn.addEventListener("click", () => {
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("row", "g-2", "mb-2");

        imageDiv.innerHTML = `
            <div class="col-md-11">
                <input type="url" class="form-control" placeholder="URL da imagem" name="imageUrl" required>
            </div>
            <div class="col-md-1 text-end">
                <button type="button" class="btn btn-danger btn-sm remove-btn">&times;</button>
            </div>
        `;

        imageDiv.querySelector(".remove-btn").addEventListener("click", () => {
            imagesContainer.removeChild(imageDiv);
        });

        imagesContainer.appendChild(imageDiv);
    });

    // Submissão do formulário
    createEventForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            showAlert("danger", "Você precisa estar logado para criar um evento.");
            return;
        }

        const eventData = {
            name: document.getElementById("name").value,
            location: document.getElementById("location").value,
            dateHour: document.getElementById("dateHour").value,
            capacity: parseInt(document.getElementById("capacity").value),
            ageGroup: document.getElementById("ageGroup").value,
            spaceType: document.getElementById("spaceType").value,
            periodicity: document.getElementById("periodicity").value,
            eventType: document.getElementById("eventType").value,
            description: document.getElementById("description").value,
            ticketLink: document.getElementById("ticketLink").value || null,
            tags: document.getElementById("tags").value.split(",").map(tag => tag.trim()).filter(Boolean),
            images: [],
            attractions: []
        };

        // Coleta imagens
        document.querySelectorAll("input[name='imageUrl']").forEach(input => {
            if (input.value.trim()) {
                eventData.images.push({ url: input.value.trim() });
            }
        });

        // Coleta atrações
        const names = document.querySelectorAll("input[name='attractionName']");
        const types = document.querySelectorAll("input[name='attractionType']");

        for (let i = 0; i < names.length; i++) {
            if (names[i].value.trim() && types[i].value.trim()) {
                eventData.attractions.push({
                    name: names[i].value.trim(),
                    type: types[i].value.trim()
                });
            }
        }

        console.log(eventData);

        // try {
        //     const response = await fetch("http://localhost:8080/api/events", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         },
        //         body: JSON.stringify(eventData)
        //     });

        //     const data = await response.json();

        //     if (!response.ok) {
        //         throw new Error(data.message || "Erro ao criar evento.");
        //     }

        //     showAlert("success", "Evento criado com sucesso!");
        //     createEventForm.reset();
        //     attractionsContainer.innerHTML = "";
        //     imagesContainer.innerHTML = "";

        // } catch (error) {
        //     console.error(error);
        //     showAlert("danger", error.message);
        // }
    });

    function showAlert(type, message) {
        const alertBox = document.getElementById("alert");
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove("d-none");

        setTimeout(() => alertBox.classList.add("d-none"), 5000);
    }
});
