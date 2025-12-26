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

// Gradients (PASTEL, CLASSY)
const gradients = [
    "linear-gradient(135deg, #f6d365, #fda085)", // peach
    "linear-gradient(135deg, #a1c4fd, #c2e9fb)", // blue
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)", // pink
    "linear-gradient(135deg, #d4fc79, #96e6a1)", // green
    "linear-gradient(135deg, #ffecd2, #fcb69f)"  // tan
];

// Goofy icons
const icons = [
    "Ig1.jpg","Ig2.jpg","Ig3.jpg","Ig4.jpg","Ig5.jpg",
    "Ig6.jpg","Ig7.jpg","Ig8.jpg","Ig9.jpg","Ig10.jpg"
];

// Toggle name field
anonCheckbox.addEventListener("change", () => {
    nameInput.disabled = anonCheckbox.checked;
    if (anonCheckbox.checked) nameInput.value = "";
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

// 🔁 REALTIME WALL
db.collection("posts")
.orderBy("time", "desc")
.onSnapshot(snapshot => {
    wall.innerHTML = "";

    snapshot.forEach(doc => {
        const data = doc.data();
        const post = document.createElement("div");
        post.classList.add("post-textbox");

        // RANDOM STYLE
        const gradient = gradients[Math.floor(Math.random() * gradients.length)];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        post.style.background = gradient;

        // 🔐 CENSOR ONLY NAMED POSTS
        let displayText;
        if (data.isAnonymous) {
            displayText = data.text; // fully visible
        } else {
            displayText = "*".repeat(data.text.length); // censored
        }

        post.innerHTML = `
            <div class="name">${escapeHTML(data.name)}</div>
            <div class="time">${new Date(data.time.toMillis()).toLocaleString()}</div>
            <p>${escapeHTML(displayText)}</p>
            <div class="post-image" style="background-image:url('${icon}')"></div>
        `;

        wall.appendChild(post);
    });
});

// 📝 SUBMIT
form.addEventListener("submit", async e => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    const isAnonymous = anonCheckbox.checked;
    const name = isAnonymous ? "~Anon <3" : nameInput.value.trim();

    if (!isAnonymous && !name) {
        alert("Enter your name or post anonymously.");
        return;
    }

    await db.collection("posts").add({
        name: name,
        text: text,
        isAnonymous: isAnonymous,
        time: firebase.firestore.Timestamp.now()
    });

    form.reset();
    anonCheckbox.checked = false;
    nameInput.disabled = false;
});    anonCheckbox.checked = false;
    nameInput.disabled = false;
});});
