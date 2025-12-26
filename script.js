// 🔥 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBbVHB-sjFqGDvpYiRTof8zdqF6oVEfYxo",
    authDomain: "dexxer-43e55.firebaseapp.com",
    projectId: "dexxer-43e55",
    storageBucket: "dexxer-43e55.appspot.com",
    messagingSenderId: "80900359866",
    appId: "1:80900359866:web:818425eff775c7f55fe483"
};

// FIREBASE SETUP
const firebaseConfig = {
    // <-- your Firebase config here -->
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ELEMENTS
const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const anonCheckbox = document.getElementById("anonymous");
const messageInput = document.getElementById("message");
const wall = document.getElementById("wall");

// AES Encryption (simple example for named messages)
const secretKey = "DexxerSecretKey"; // change this to something secure

function encryptMessage(message) {
    return btoa(unescape(encodeURIComponent(message))); // simple base64
}

function decryptMessage(message) {
    return decodeURIComponent(escape(atob(message)));
}

// TOGGLE NAME REQUIRED BASED ON ANONYMOUS CHECKBOX
anonCheckbox.addEventListener("change", () => {
    if (anonCheckbox.checked) {
        nameInput.value = "";
        nameInput.disabled = true;
        nameInput.removeAttribute("required");
    } else {
        nameInput.disabled = false;
        nameInput.setAttribute("required", "");
    }
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

// RENDER POSTS
db.collection("posts").orderBy("time", "desc").onSnapshot(snapshot => {
    wall.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();

        const post = document.createElement("div");
        post.classList.add("post-textbox");

        // Decrypt if message is encrypted
        let displayText = data.isNamed ? "••••••••••" : data.text;
        if (data.isNamed && window.showSecret) {
            displayText = decryptMessage(data.text);
        }

        post.innerHTML = `
            <div class="name">${escapeHTML(data.name)}</div>
            <div class="time">${new Date(data.time).toLocaleString()}</div>
            <p>${escapeHTML(displayText)}</p>
        `;

        wall.appendChild(post);
    });
});

// FORM SUBMIT
form.addEventListener("submit", async e => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    const isAnonymous = anonCheckbox.checked;
    let name = isAnonymous ? "~Anon <3" : nameInput.value.trim();

    let messageToStore = text;
    let isNamed = false;

    if (!isAnonymous) {
        messageToStore = encryptMessage(text);
        isNamed = true;
    }

    await db.collection("posts").add({
        name: name,
        text: messageToStore,
        time: Date.now(),
        isNamed: isNamed
    });

    form.reset();
    anonCheckbox.checked = false;
    nameInput.disabled = false;
});
