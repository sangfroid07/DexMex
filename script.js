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

// Toggle name input required based on Anonymous
anonCheckbox.addEventListener("change", () => {
    if (anonCheckbox.checked) {
        nameInput.value = "";
        nameInput.disabled = true;
    } else {
        nameInput.disabled = false;
    }
});

// Escape HTML
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
    })[m]);
}

// Real-time listener
db.collection("posts").orderBy("time", "desc").onSnapshot(snapshot => {
    wall.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();

        const post = document.createElement("div");
        post.classList.add("post-textbox");

        let displayText = data.censored ? "*".repeat(data.text.length) : data.text;

        post.innerHTML = `
            <div class="name">${escapeHTML(data.name)}</div>
            <div class="time">${new Date(data.time.toMillis()).toLocaleString()}</div>
            <p>${escapeHTML(displayText)}</p>
        `;

        wall.appendChild(post);
    });
});

// Submit form
form.addEventListener("submit", async e => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    let name, censored;
    if (anonCheckbox.checked) {
        name = "~Anon <3";
        censored = false;
    } else {
        name = nameInput.value.trim();
        if (!name) {
            alert("Please enter your name or check 'Post as Anonymous'");
            return;
        }
        censored = true;
    }

    await db.collection("posts").add({
        name: name,
        text: text,
        censored: censored,
        time: firebase.firestore.Timestamp.now()
    });

    form.reset();
    anonCheckbox.checked = false;
    nameInput.disabled = false;
});
