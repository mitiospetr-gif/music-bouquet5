﻿
/* =========================
   DECODE HASH
========================= */

function decodeHash(str){
    try{
        const pad = '='.repeat((4 - str.length % 4) % 4);

        const json = decodeURIComponent(
            atob((str + pad).replace(/-/g,'+').replace(/_/g,'/'))
        );

        return JSON.parse(json);

    } catch(e){
        console.log("Decode error:", e);
        return null;
    }
}

/* =========================
   LOAD GIFT PAGE
========================= */

function loadGift(){

    const hash = location.hash.slice(1);
    if(!hash) return;

    const data = decodeHash(hash);

    if(!data){
        document.body.innerHTML = "<h2 style='color:white;text-align:center'>Ошибка ссылки</h2>";
        return;
    }

    /* =========================
       TEXT FIELDS
    ========================= */

    const set = (id, value) => {
        const el = document.getElementById(id);
        if(el) el.textContent = value || "";
    };

    set("title", data.t);
    set("text", data.x);
    set("author", data.a);

    /* =========================
       IMAGE LOGIC (CRITICAL FIX)
    ========================= */

    const img = document.getElementById("img");

    if(data.i){

        let src = data.i;

        // 💡 base64 image
        if(src.startsWith("data:")){
            img.src = src;
        }

        // 💡 system bouquet
        else{
            img.src = "images/bouquets/" + src + ".webp";
        }

        img.onload = () => {
            img.style.display = "block";
        };

        img.onerror = () => {
            console.log("Image not found:", src);
            img.style.display = "none";
        };
    }

    /* =========================
       LINKS
    ========================= */

    const yt = document.getElementById("yt");
    const ym = document.getElementById("ym");

    if(data.y){
        yt.href = data.y;
    } else {
        yt.style.display = "none";
    }

    if(data.m){
        ym.href = data.m;
    } else {
        ym.style.display = "none";
    }
}

/* =========================
   INIT
========================= */

window.addEventListener("load", loadGift);