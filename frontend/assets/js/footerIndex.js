document.addEventListener("DOMContentLoaded", () => {
    const footerContainer = document.createElement("div");
    fetch("./components/footer.html")
        .then((res) => res.text())
        .then((html) => {
            footerContainer.innerHTML = html;
            document.body.appendChild(footerContainer);
        });
});
