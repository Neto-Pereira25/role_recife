const userStorage = localStorage.getItem("user");
const user = JSON.parse(userStorage);
let currentChatId = null;

console.log(user);

async function loadChats() {
    let chats = [];

    const chatList = document.getElementById("chatList");
    chatList.innerHTML = '';

    if (!user) {
        window.location.href = "/frontend/assets/pages/login.html";
        return;
    }

    if (user.userType === "COMMON_USER") {
        const res = await fetch(`http://localhost:8080/api/chat/common/${user.userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });

        if (!res.ok) {
            console.log('Erro ao buscar chats do usuário:', res);
        }

        chats = await res.json();

        chats.forEach(async chat => {
            const userReq = await getUserName(chat.ownerUserId);
            const li = document.createElement("li");
            li.textContent = `Chat com ${userReq.name}`;
            li.onclick = () => openChat(chat.id, userReq.name);
            chatList.appendChild(li);
        });
    } else if (user.userType === "EVENT_OWNER_USER") {
        const res = await fetch(`http://localhost:8080/api/chat/owner/${user.userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });

        if (!res.ok) {
            console.log('Erro ao buscar chats do usuário:', res);
        }

        chats = await res.json();

        chats.forEach(async chat => {
            const userReq = await getUserName(chat.commonUserId);
            const li = document.createElement("li");
            li.textContent = `Chat com ${userReq.name}`;
            li.onclick = () => openChat(chat.id, userReq.name);
            chatList.appendChild(li);
        });
    }
}

async function getUserName(userId) {
    const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });

    if (!res.ok) {
        console.log('Erro ao buscar nome do usuário:', res);
    }

    const userName = await res.json();
    return userName;
}

async function openChat(chatId, userName) {
    currentChatId = chatId;
    document.getElementById('chatWith').textContent = `Conversando com ${userName}`;
    const res = await fetch(`http://localhost:8080/api/messages/${chatId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });

    if (!res.ok) {
        console.log("Erro ao buscar as mensagens do chat", res);
    }

    const messages = await res.json();
    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";

    messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = msg.senderId == user.userId ? "message sent" : "message received";
        div.textContent = msg.content;
        container.appendChild(div);
    });
}

async function sendMessage() {
    const input = document.getElementById("messageInput");
    const content = input.value.trim();
    if (!content || !currentChatId) return;

    await fetch("http://localhost:8080/api/messages/send", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
            chatId: currentChatId,
            content,
            senderId: user.userId
        })
    });

    input.value = "";
    openChat(currentChatId, document.getElementById("chatWith").textContent.replace("Conversando com ", ""));
}

document.getElementById("sendButton").addEventListener("click", sendMessage);
window.onload = loadChats;
