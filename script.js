// 🔥 FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyBbVHB-sjFqGDvpYiRTof8zdqF6oVEfYxo",
    authDomain: "dexxer-43e55.firebaseapp.com",
    projectId: "dexxer-43e55",
    storageBucket: "dexxer-43e55.appspot.com",
    messagingSenderId: "80900359866",
    appId: "1:80900359866:web:818425eff775c7f55fe483"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ELEMENTS
const form = document.getElementById("messageForm");
const wall = document.getElementById("wall");
const anon = document.getElementById("anonymous");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");

// PASTEL GRADIENTS
const gradients = [
    'linear-gradient(135deg, #f4b1b1, #b8c6ff)',
    'linear-gradient(135deg, #ffd6c9, #ff9aa2)',
    'linear-gradient(135deg, #c7e9d8, #b5d8ff)',
    'linear-gradient(135deg, #f2f2f2, #cfcfcf)',
    'linear-gradient(135deg, #f3e6d3, #e6d5b8)'
];

// GOOFY IMAGES
const images = [
    'Ig1.jpg','Ig2.jpg','Ig3.jpg','Ig4.jpg','Ig5.jpg'
];

// ANON TOGGLE
anon.addEventListener("change", () => {
    nameInput.disabled = anon.checked;
    if (anon.checked) nameInput.value = "";
});

// REALTIME LISTENER
db.collection("posts")
  .orderBy("time", "desc")
  .onSnapshot(snapshot => {
      wall.innerHTML = "";
      snapshot.forEach(doc => renderPost(doc.data()));
  });

// RENDER POST
function renderPost(data) {
    const post = document.createElement("div");
    post.className = "post";

    post.style.background =
        gradients[Math.floor(Math.random() * gradients.length)];

    const img =
        images[Math.floor(Math.random() * images.length)];

    post.innerHTML = `
        <div class="name">${escapeHTML(data.name)}</div>
        <div class="time">${new Date(data.time).toLocaleString()}</div>
        <p>${escapeHTML(data.text)}</p>
        <div class="post-image"></div>
    `;

    post.querySelector(".post-image").style.backgroundImage =
        `url("${img}")`;

    wall.appendChild(post);
}

// SUBMIT
form.addEventListener("submit", async e => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    const name =
        (!anon.checked && nameInput.value.trim())
            ? nameInput.value.trim()
            : "~Anon <3";

    await db.collection("posts").add({
        name,
        text,
        time: Date.now()
    });

    form.reset();
    anon.checked = true;
    nameInput.disabled = true;
});

// ESCAPE HTML
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
    })[m]);
}