const fileInput = document.getElementById("fileInput");
const partsSelect = document.getElementById("partsSelect");
const preview = document.getElementById("preview");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const grayscale = document.getElementById("grayscale");

let images = [];
let croppedImages = [];

fileInput.addEventListener("change", handleFiles);

document.getElementById("processImage").addEventListener("click", processImages);
document.getElementById("downloadAll").addEventListener("click", cropAndDownload);

brightness.addEventListener("input", applyFilters);
contrast.addEventListener("input", applyFilters);
grayscale.addEventListener("input", applyFilters);

function handleFiles(event) {
    const files = event.target.files;
    images = [];
    preview.innerHTML = "";
    [...files].forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                images.push(img);
                updatePreview();
            };
        };
        reader.readAsDataURL(file);
    });
}

function updatePreview() {
    preview.innerHTML = "";
    images.forEach(img => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width / 4;
        canvas.height = img.height / 4;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        preview.appendChild(canvas);
    });
}

function processImages() {
    const parts = parseInt(partsSelect.value);
    croppedImages = [];
    preview.innerHTML = "";
    images.forEach(img => {
        const width = img.width / parts;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = img.height;

        for (let i = 0; i < parts; i++) {
            canvas.width = width;
            ctx.drawImage(img, width * i, 0, width, img.height, 0, 0, width, img.height);
            croppedImages.push(canvas.toDataURL());
            const croppedCanvas = document.createElement("canvas");
            croppedCanvas.width = width;
            croppedCanvas.height = img.height;
            croppedCanvas.getContext("2d").drawImage(canvas, 0, 0);
            preview.appendChild(croppedCanvas);
        }
    });
}

function cropAndDownload() {
    if (croppedImages.length === 0) {
        alert("No images to download. Please process the images first.");
        return;
    }
    croppedImages.forEach((dataURL, index) => {
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `image_part_${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function applyFilters() {
    const filterString = `
        brightness(${brightness.value}%)
        contrast(${contrast.value}%)
        grayscale(${grayscale.value}%)
    `;
    preview.style.filter = filterString;
}
const aspectRatioSelect = document.getElementById("aspectRatioSelect");
const customAspectRatio = document.getElementById("customAspectRatio");
const aspectWidthInput = document.getElementById("aspectWidth");
const aspectHeightInput = document.getElementById("aspectHeight");

aspectRatioSelect.addEventListener("change", () => {
    if (aspectRatioSelect.value === "custom") {
        customAspectRatio.style.display = "flex";
    } else {
        customAspectRatio.style.display = "none";
    }
});

function processImages() {
    const parts = parseInt(partsSelect.value);
    const aspectRatio = aspectRatioSelect.value === "custom" 
        ? parseFloat(aspectWidthInput.value) / parseFloat(aspectHeightInput.value)
        : parseFloat(aspectRatioSelect.value.split(":")[0]) / parseFloat(aspectRatioSelect.value.split(":")[1]);
    
    croppedImages = [];
    preview.innerHTML = "";
    images.forEach(img => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const partWidth = img.width / parts;
        const partHeight = partWidth / aspectRatio;
        
        for (let i = 0; i < parts; i++) {
            canvas.width = partWidth;
            canvas.height = partHeight;
            ctx.drawImage(img, partWidth * i, 0, partWidth, img.height, 0, 0, partWidth, partHeight);
            croppedImages.push(canvas.toDataURL());
            const croppedCanvas = document.createElement("canvas");
            croppedCanvas.width = partWidth;
            croppedCanvas.height = partHeight;
            croppedCanvas.getContext("2d").drawImage(canvas, 0, 0);
            preview.appendChild(croppedCanvas);
        }
    });
}
