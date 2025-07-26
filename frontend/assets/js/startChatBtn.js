const url = new URLSearchParams(window.location.search);
const eventIdUrl = url.get("id");

const user = JSON.parse(localStorage.getItem("user"));

const startChatBtn = document.getElementById("startChatBtn");

if (user.userType === "EVENT_OWNER_USER") {
    startChatBtn.textContent = "Usuários Interessados";
}

startChatBtn.addEventListener("click", async () => {
    startChatBtn.disabled = true;

    // Buscar o evento
    try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);

        if (!response.ok) throw new Error("Evento não encontrado.");

        const event = await response.json();

        if (user.userType === "COMMON_USER") { // Criar um chat
            createChat(userId, event.ownerId);
        } else { // 
            window.location.href = `../listInterestedUser.html?id=${event.id}&eventName=${event.name}`;
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar detalhes do evento.");
    } finally {
        startChatBtn.disabled = false;
    }
});

async function createChat(userId, ownerId) {
    try {
        const res = await fetch(`http://localhost:8080/api/chat/start?ownerUserId=${ownerId}&commonUserId=${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            }
        });

        if (!res.ok) {
            console.log("Erro ao criar chat:");
            console.log(res);
            return;
        }

        const chat = await res.json();

        window.location.href = `../chat.html?chatId=${chat.id}`;
    } catch (error) {
        console.log(error);
    }
}