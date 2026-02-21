document.addEventListener("DOMContentLoaded", async () => {

    await loadRecords();

    const params = new URLSearchParams(window.location.search);
    const rawPage = params.get("page");

    let startIndex = 0;

    if (rawPage !== null) {

        const pageParam = parseInt(rawPage);

        if (
            isNaN(pageParam) ||
            rawPage.match(/[^0-9]/) ||
            pageParam < 1 ||
            pageParam > records.length
        ) {
            window.location.href = "/404.html";
            return;
        }

        startIndex = pageParam - 1;
    }

    // 🔥 IMPORTANT: Only load page, do NOT rewrite URL here
    loadPage(startIndex);
});


// Load JSON records
async function loadRecords() {
    try {
        const response = await fetch(RECORDS_PATH);
        records = await response.json();
    } catch (error) {
        console.error("Errore nel caricamento del JSON:", error);
    }
}


// Load specific page
function loadPage(index) {

    if (!records[index]) return;

    currentIndex = index;

    const record = records[index];

    document.getElementById("pdfTitle").innerText = record.name;
    document.getElementById("pdfDescription").innerText = record.description;

    document.getElementById("pageIndicator").innerText =
        "Pagina " + (index + 1);

    updateNavigation();
}
