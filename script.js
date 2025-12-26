// 🔥 Firebase Config
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

// DOM
const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const anonCheckbox = document.getElementById("anonymous");
const wall = document.getElementById("wall");

// goofy icons
const icons = [
    "Ig1.jpg","Ig2.jpg","Ig3.jpg","Ig4.jpg","Ig5.jpg",
    "Ig6.jpg","Ig7.jpg","Ig8.jpg","Ig9.jpg","Ig10.jpg"
];

// gradients
const gradients = [
    "gradient-1",
    "gradient-2",
    "gradient-3",
    "gradient-4",
    "gradient-5"
];

// toggle name input
anonCheckbox.addEventListener("change", () => {
    nameInput.disabled = anonCheckbox.checked;
    if (anonCheckbox.checked) nameInput.value = "";
});

// escape html
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[m]);
}

// realtime posts
db.collection("posts").orderBy("time", "desc").onSnapshot(snapshot => {
    wall.innerHTML = "";

    snapshot.forEach(doc => {
        const d = doc.data();

        const box = document.createElement("div");
        const grad = gradients[Math.floor(Math.random() * gradients.length)];
        const icon = icons[Math.floor(Math.random() * icons.length)];

        box.className = `post-textbox ${grad}`;

        const textToShow = d.censored ? "*".repeat(d.text.length) : d.text;

        box.innerHTML = `
            <img src="${icon}">
            <div class="name">${escapeHTML(d.name)}</div>
            <div class="time">${new Date(d.time.toMillis()).toLocaleString()}</div>
            <p>${escapeHTML(textToShow)}</p>
        `;

        wall.appendChild(box);
    });
});

// submit
form.addEventListener("submit", async e => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    let name, censored;

    if (anonCheckbox.checked) {
        name = "~Anon <3";
        censored = false; // anonymous NOT censored
    } else {
        name = nameInput.value.trim();
        if (!name) {
            alert("Enter your name or choose Anonymous");
            return;
        }
        censored = true; // named messages censored
    }

    await db.collection("posts").add({
        name,
        text,
        censored,
        time: firebase.firestore.Timestamp.now()
    });

    form.reset();
    nameInput.disabled = false;
});
