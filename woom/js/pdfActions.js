// Buttons
const openBtn = document.getElementById("openBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const qrBtn = document.getElementById("qrBtn");

const qrModal = document.getElementById("qrModal");
const qrImage = document.getElementById("qrImage");
const closeQr = document.getElementById("closeQr");

// 🔥 Description Expand Elements
const expandBtn = document.getElementById("expandDescBtn");
const descModal = document.getElementById("descModal");
const descModalContent = document.getElementById("descModalContent");
const closeDesc = document.getElementById("closeDesc");


// ===== MAIN ACTION HANDLER =====
async function handlePDFAction(type) {

    const record = records[currentIndex];
    if (!record) return;

    let blob = await getCachedFile(record.link);

    // If not cached → download with progress
    if (!blob) {
        try {
            blob = await fetchWithProgress(record.link);
            await saveFileToCache(record.link, blob);
        } catch (err) {
            alert("Errore durante il caricamento del file.");
            return;
        }
    }

    // ===== OPEN =====
    if (type === "open") {
        const blobUrl = URL.createObjectURL(blob);
        window.location.href = blobUrl;

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 5000);
    }

    // ===== DOWNLOAD =====
    if (type === "download") {

        const downloadBlob = new Blob(
            [blob],
            { type: "application/octet-stream" }
        );

        const blobUrl = URL.createObjectURL(downloadBlob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = record.download;

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }, 300);
    }
}


// ===== SHARE =====
async function sharePDF() {

    const fullUrl =
        window.location.origin +
        window.location.pathname +
        "?page=" + (currentIndex + 1);

    const record = records[currentIndex];
    if (!record) return;

    if (navigator.share) {
        try {
            await navigator.share({
                title: record.name,
                text: record.description,
                url: fullUrl
            });
        } catch {}
    } else {
        await navigator.clipboard.writeText(fullUrl);
        alert("Link copiato!");
    }
}


// ===== QR =====
function openQR() {

    const fullUrl =
        window.location.origin +
        window.location.pathname +
        "?page=" + (currentIndex + 1);

    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=" +
        encodeURIComponent(fullUrl);

    qrModal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeQR() {
    qrModal.style.display = "none";
    document.body.style.overflow = "";
}


// ===== DESCRIPTION EXPAND =====
function openDescriptionModal() {
    const desc = document.getElementById("pdfDescription").innerHTML;
    descModalContent.innerHTML = desc;

    descModal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeDescriptionModal() {
    descModal.style.display = "none";
    document.body.style.overflow = "";
}


// ===== EVENT LISTENERS =====
openBtn.addEventListener("click", () => handlePDFAction("open"));
downloadBtn.addEventListener("click", () => handlePDFAction("download"));
shareBtn.addEventListener("click", sharePDF);
qrBtn.addEventListener("click", openQR);

closeQr.addEventListener("click", closeQR);

qrModal.addEventListener("click", (e) => {
    if (e.target === qrModal) {
        closeQR();
    }
});

// Expand Description Events
expandBtn.addEventListener("click", openDescriptionModal);
closeDesc.addEventListener("click", closeDescriptionModal);

descModal.addEventListener("click", (e) => {
    if (e.target === descModal) {
        closeDescriptionModal();
    }
});