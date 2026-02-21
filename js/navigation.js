// Navigation Button Elements
let bgAngle = 180;

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


// 🔥 Read page from URL
function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get("page"));

    if (!isNaN(pageParam) && pageParam >= 1 && pageParam <= records.length) {
        return pageParam - 1;
    }

    return 0;
}


// 🔥 Update URL (ONLY when navigating)
function updateURL(index) {
    const pageNumber = index + 1;
    const newUrl = window.location.pathname + "?page=" + pageNumber;
    window.history.replaceState(null, "", newUrl);
}


// 🔥 Background Rotate
function rotateBackground(direction) {
    bgAngle += direction * 10;
    document.documentElement.style.setProperty("--bg-angle", bgAngle + "deg");
}


// Update Navigation Visibility
function updateNavigation() {
    prevBtn.style.visibility = (currentIndex === 0) ? "hidden" : "visible";
    nextBtn.style.visibility = (currentIndex === records.length - 1) ? "hidden" : "visible";
}


// 🔥 Safe Page Change Wrapper
function goToPage(index) {
    loadPage(index);
    updateURL(index);
    updateNavigation();
}


// Previous Button
prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        goToPage(currentIndex - 1);
        rotateBackground(-1);
    }
});


// Next Button
nextBtn.addEventListener("click", () => {
    if (currentIndex < records.length - 1) {
        goToPage(currentIndex + 1);
        rotateBackground(1);
    }
});


