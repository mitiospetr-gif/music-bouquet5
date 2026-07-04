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


/* 📁 загрузка из галереи (BASE64) */
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


/* 🔗 SHARE LINK (без внешних сервисов) */
function createShareLink(data) {

    const clean = {};

    if (data.title) clean.t = data.title;
    if (data.author) clean.a = data.author;
    if (data.text) clean.x = data.text;
    if (data.youtube) clean.y = data.youtube;
    if (data.yandex) clean.m = data.yandex;

    /* 💐 IMAGE PRIORITY */
    if (data.image) {
        clean.i = data.image; // системный букет
    }
    else if (userImages.length > 0) {
        clean.i = userImages[userImages.length - 1]; // base64
    }

    const encoded = btoa(encodeURIComponent(JSON.stringify(clean)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

    return location.origin + "/gift.html#" + encoded;
}


/* ✨ CREATE */
document.getElementById("createBtn").onclick = () => {

    const data = {
        title: document.getElementById("title")?.value || "",
        author: document.getElementById("author")?.value || "",
        text: document.getElementById("text")?.value || "",
        youtube: document.getElementById("youtube")?.value || "",
        yandex: document.getElementById("yandex")?.value || "",
        image: selectedBouquet || null
    };

    const link = createShareLink(data);

    document.getElementById("result").textContent = link;
    window.generatedLink = link;
};


/* 📋 COPY */
document.getElementById("copyBtn").onclick = async () => {
    await navigator.clipboard.writeText(window.generatedLink || "");
    alert("Ссылка скопирована");
};
