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

// DOM Elements
const form = document.getElementById("messageForm");
const wall = document.getElementById("wall");
const anonCheckbox = document.getElementById("anonymous");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("messageInput");

// Checkbox default
anonCheckbox.checked = false;
nameInput.disabled = false;

// Toggle name field
anonCheckbox.addEventListener("change", () => {
    nameInput.disabled = anonCheckbox.checked;
    if (anonCheckbox.checked) nameInput.value = "";
});

// Encryption key for named messages (change this)
const ENC_KEY = 3;

// Simple Caesar cipher
function encrypt(text) {
    return text.split('').map(c => String.fromCharCode(c.charCodeAt(0)+ENC_KEY)).join('');
}
function decrypt(text) {
    return text.split('').map(c => String.fromCharCode(c.charCodeAt(0)-ENC_KEY)).join('');
}

// REALTIME WALL
db.collection("posts").orderBy("time", "desc").onSnapshot(snapshot => {
    wall.innerHTML = "";
    snapshot.forEach(doc => renderPost(doc.data()));
});

// Render function
function renderPost(data) {
    const post = document.createElement("div");
    post.classList.add("post");

    // Gradient backgrounds
    const gradients = [
        'linear-gradient(135deg, #f6d365, #fda085)',
        'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
        'linear-gradient(135deg, #cfd9df, #e2ebf0)',
        'linear-gradient(135deg, #d4fc79, #96e6a1)',
        'linear-gradient(135deg, #fddb92, #d1fdff)'
    ];
    post.style.background = gradients[Math.floor(Math.random() * gradients.length)];

    // Encrypt check
    let displayText = data.text;
    if (!data.anonymous) {
        displayText = '*'.repeat(displayText.length); // masked
    }

    post.innerHTML = `
        <div class="name">${escapeHTML(data.name)}</div>
        <div class="time">${new Date(data.time).toLocaleString()}</div>
        <p>${escapeHTML(displayText)}</p>
    `;

    wall.appendChild(post);
}

// Submit
form.addEventListener("submit", async e => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const name = (!anonCheckbox.checked && nameInput.value.trim() !== "")
        ? nameInput.value.trim()
        : "~Anon <3";

    const postData = {
        name: name,
        text: (!anonCheckbox.checked) ? encrypt(text) : text, // encrypt named messages
        time: Date.now(),
        anonymous: anonCheckbox.checked
    };

    await db.collection("posts").add(postData);

    form.reset();
    anonCheckbox.checked = false;
    nameInput.disabled = false;
});    nameField.disabled = false;   // reset to default
    nameField.value = "";         // clear name input
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
