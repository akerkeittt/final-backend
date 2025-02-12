document.getElementById("toggleFacts").addEventListener("click", () => {
    const factsList = document.getElementById("factsList");
    if (factsList.style.display === "none" || factsList.style.display === "") {
        factsList.style.display = "block";
    } else {
        factsList.style.display = "none";
    }


    // Поиск по фактам
    document.querySelector(".search-input").addEventListener("input", (e) => {
        const filter = e.target.value.toLowerCase();
        document.querySelectorAll("#factsList li").forEach((fact) => {
            fact.style.display = fact.textContent.toLowerCase().includes(filter) ? "block" : "none";
        });
    });

    // Темная тема
    const toggleThemeButton = document.getElementById('toggleThemeButton');
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        toggleThemeButton.textContent = document.body.classList.contains('dark-theme') ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
});
