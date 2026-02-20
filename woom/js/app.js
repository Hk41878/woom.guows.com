document.addEventListener("DOMContentLoaded", async () => {

    await loadRecords();

    const params = new URLSearchParams(window.location.search);
    const rawPage = params.get("page");

    // If ?page parameter exists
    if (rawPage !== null) {

        const pageParam = parseInt(rawPage);

        // ❌ Invalid conditions
        if (
            isNaN(pageParam) ||
            rawPage.match(/[^0-9]/) ||   // letters present
            pageParam < 1 ||
            pageParam > records.length
        ) {
            window.location.href = "/404.html";
            return;
        }

        loadPage(pageParam - 1);
        updateURL(pageParam - 1);

    } else {
        // No parameter → default page 1
        loadPage(0);
        updateURL(0);
    }
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

    // Update Title & Description
    document.getElementById("pdfTitle").innerText = record.name;
    document.getElementById("pdfDescription").innerText = record.description;

    // Update Navigation Indicator
    document.getElementById("pageIndicator").innerText =
        "Pagina " + (index + 1);

    updateNavigation();
}