﻿let selected = null;
let image = null;

/* select bouquet */
document.querySelectorAll(".bouquet").forEach(b=>{
    b.onclick = ()=>{
        document.querySelectorAll(".bouquet").forEach(x=>x.classList.remove("active"));
        b.classList.add("active");
        selected = b.dataset.bouquet;
    };
});

/* file */
document.getElementById("fileInput").onchange = e=>{
    const file = e.target.files[0];
    if(!file) return;

    const r = new FileReader();
    r.onload = ev=> image = ev.target.result;
    r.readAsDataURL(file);
};

/* encode */
function encode(data){
    return btoa(encodeURIComponent(JSON.stringify(data)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

/* create */
document.getElementById("createBtn").onclick = ()=>{

    const data = {
        t:title.value,
        a:author.value,
        x:text.value,
        y:youtube.value,
        m:yandex.value,
        i:image || selected
    };

    const link = location.origin+"/gift.html#"+encode(data);

    result.textContent = link;
    window.generated = link;
};

/* copy */
document.getElementById("copyBtn").onclick = ()=>{
    navigator.clipboard.writeText(window.generated || "");
};
