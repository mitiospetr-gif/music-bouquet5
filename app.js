﻿
/* =========================
   STATE
========================= */

let selected = null;
let image = null;
window.generated = null;

/* =========================
   BOUQUET SELECT
========================= */

document.querySelectorAll(".bouquet").forEach(b => {
    b.onclick = () => {

        document.querySelectorAll(".bouquet")
            .forEach(x => x.classList.remove("active"));

        b.classList.add("active");
        selected = b.dataset.bouquet;
    };
});

/* =========================
   FILE UPLOAD (BASE64)
========================= */

document.getElementById("fileInput").onchange = e => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = ev => {
        image = ev.target.result;
    };

    reader.readAsDataURL(file);
};

/* =========================
   ENCODE
========================= */

function encode(data){
    return btoa(encodeURIComponent(JSON.stringify(data)))
        .replace(/\+/g,'-')
        .replace(/\//g,'_')
        .replace(/=/g,'');
}

/* =========================
   CREATE LINK
========================= */

document.getElementById("createBtn").onclick = () => {

    const data = {
        t: document.getElementById("title").value,
        a: document.getElementById("author").value,
        x: document.getElementById("text").value,
        y: document.getElementById("youtube").value,
        m: document.getElementById("yandex").value,
        i: image || selected
    };

    const link = location.origin + "/gift.html#" + encode(data);

    document.getElementById("result").textContent = link;
    window.generated = link;
};

/* =========================
   TOAST
========================= */

function showToast(text){
    let t = document.createElement("div");
    t.className = "toast";
    t.innerText = text;
    document.body.appendChild(t);

    setTimeout(() => t.classList.add("show"), 10);

    setTimeout(() => {
        t.classList.remove("show");
        setTimeout(() => t.remove(), 250);
    }, 1500);
}

/* =========================
   COPY LINK
========================= */

document.getElementById("copyBtn").onclick = async () => {

    if(!window.generated){
        showToast("Сначала создай ссылку");
        return;
    }

    try{
        await navigator.clipboard.writeText(window.generated);
        showToast("Ссылка скопирована ✅");
    }catch(e){
        showToast("Ошибка копирования");
    }
};