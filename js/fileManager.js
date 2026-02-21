const DB_NAME = "WOOM_PDF_CACHE";
const STORE_NAME = "pdf_files";
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours


// ===== OPEN DATABASE =====
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("DB Error");
    });
}


// ===== GET FILE FROM CACHE =====
async function getCachedFile(fileKey) {
    try {
        const db = await openDB();

        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(fileKey);

            request.onsuccess = () => {
                const data = request.result;

                if (data && (Date.now() - data.timestamp < EXPIRY_TIME)) {
                    resolve(data.blob);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => resolve(null);
        });

    } catch {
        return null;
    }
}


// ===== SAVE FILE TO CACHE =====
async function saveFileToCache(fileKey, blob) {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        store.put(
            {
                blob: blob,
                timestamp: Date.now()
            },
            fileKey
        );

    } catch (err) {
        console.log("Cache Save Error:", err);
    }
}


// ===== FETCH WITH PROGRESS =====
async function fetchWithProgress(url) {

    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    if (progressContainer) progressContainer.style.display = "block";
    if (progressBar) progressBar.style.width = "0%";
    if (progressText) progressText.innerText = "Scaricamento: 0%";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Errore nel download");
    }

    const reader = response.body.getReader();
    const total = +response.headers.get("Content-Length") || 0;

    let received = 0;
    let chunks = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;

        if (total > 0) {
            const percent = Math.round((received / total) * 100);
            if (progressBar) progressBar.style.width = percent + "%";
            if (progressText) progressText.innerText =
                "Scaricamento: " + percent + "%";
        }
    }

    const blob = new Blob(chunks, { type: "application/pdf" });

    if (progressContainer) progressContainer.style.display = "none";

    return blob;
}