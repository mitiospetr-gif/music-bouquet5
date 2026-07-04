let selectedBouquet = null;
let userImages = JSON.parse(localStorage.getItem("userImages") || "[]");

/* 💐 выбор букета */
window.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".bouquet").forEach(el => {

        el.addEventListener("click", () => {

            document.querySelectorAll(".bouquet")
                .forEach(b => b.classList.remove("active"));

            el.classList.add("active");

            selectedBouquet = el.dataset.bouquet;

        });

    });

});


/* 📁 загрузка галереи */
const fileInput = document.getElementById("fileInput");

if (fileInput) {
    fileInput.addEventListener("change", (e) => {

        [...e.target.files].forEach(file => {
            const reader = new FileReader();

            reader.onload = (ev) => {
                userImages.push(ev.target.result);
                localStorage.setItem("userImages", JSON.stringify(userImages));
            };

            reader.readAsDataURL(file);
        });

    });
}


/* ☁️ DROPBOX FIX (ВАЖНО) */
function fixDropbox(url) {
    if (!url) return "";

    if (!url.includes("dropbox.com")) return url;

    // убираем параметры
    const clean = url.split("?")[0];

    // scl/fi формат (новый Dropbox)
    if (clean.includes("scl/fi")) {
        return clean.replace(
            "www.dropbox.com",
            "dl.dropboxusercontent.com"
        );
    }

    // старый формат
    if (url.includes("dl=0")) {
        return url.replace("dl=0", "raw=1");
    }

    return url;
}


/* 🔗 encode */
function createShareLink(data) {

    const clean = {};

    if (data.title) clean.t = data.title;
    if (data.author) clean.a = data.author;
    if (data.text) clean.x = data.text;
    if (data.youtube) clean.y = data.youtube;
    if (data.yandex) clean.m = data.yandex;

    // 💐 приоритет изображения:
    // 1. системный букет
    // 2. dropbox/url
    // 3. галерея (localStorage)

    if (data.image) {
        clean.i = data.image;
    }
    else if (data.imageUrl) {
        clean.i = fixDropbox(data.imageUrl);
    }
    else if (userImages.length > 0) {
        clean.i = userImages[userImages.length - 1];
    }

    const encoded = btoa(encodeURIComponent(JSON.stringify(clean)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

    return location.origin + "/gift.html#" + encoded;
}


/* ✨ create */
document.getElementById("createBtn").onclick = () => {

    const data = {
        title: document.getElementById("title")?.value || "",
        author: document.getElementById("author")?.value || "",
        text: document.getElementById("text")?.value || "",
        youtube: document.getElementById("youtube")?.value || "",
        yandex: document.getElementById("yandex")?.value || "",
        image: selectedBouquet || null,
        imageUrl: document.getElementById("dropboxInput")?.value || ""
    };

    const link = createShareLink(data);

    document.getElementById("result").textContent = link;
    window.generatedLink = link;
};


/* 📋 copy */
document.getElementById("copyBtn").onclick = async () => {
    try {
        await navigator.clipboard.writeText(window.generatedLink || "");
        alert("Ссылка скопирована");
    } catch (e) {
        alert("Ошибка копирования");
    }
};
