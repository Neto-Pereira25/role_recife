document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");

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
            <a href="explore-events.html" class="btn btn-outline-primary w-100">Explorar Eventos</a>
          </div>
          <div class="col-md-4 mb-3">
            <a href="interests.html" class="btn btn-outline-success w-100">Meus Interesses</a>
          </div>
        `;
  } else if (role === "EVENT_OWNER_USER") {
    userTypeInfo.textContent = "Você está logado como Dono de Evento.";
    actions.innerHTML = `
          <div class="col-md-4 mb-3">
            <a href="create-event.html" class="btn btn-outline-primary w-100">Criar Evento</a>
          </div>
          <div class="col-md-4 mb-3">
            <a href="my-events.html" class="btn btn-outline-success w-100">Meus Eventos</a>
          </div>
        `;
  } else {
    userTypeInfo.textContent = "Tipo de usuário desconhecido.";
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  });
});
