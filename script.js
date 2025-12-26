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
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const anonCheckbox = document.getElementById("anonymous");
const wall = document.getElementById("wall");

// Random goofy images
const images = [
    "Ig1.jpg","Ig2.jpg","Ig3.jpg","Ig4.jpg","Ig5.jpg",
    "Ig6.jpg","Ig7.jpg","Ig8.jpg","Ig9.jpg","Ig10.jpg"
];

// Toggle name input based on anonymous
anonCheckbox.addEventListener("change", () => {
    if (anonCheckbox.checked) {
        nameInput.value = "";
        nameInput.disabled = true;
    } else {
        nameInput.disabled = false;
    }
});

// Escape HTML function
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
    })[m]);
}

// Render a single post
function renderPost(doc) {
    const data = doc.data();
    const post = document.createElement("div");
    post.classList.add("post-textbox");

    // Random image if avatar not set
    const img = data.avatar || images[Math.floor(Math.random() * images.length)];

    // Determine message display (censored for named, visible for anonymous)
    let displayText = (!data.isAnonymous && !data.showMessage) ? "*".repeat(data.text.length) : data.text;

    // innerHTML with name, time, text, and image
    post.innerHTML = `
        <div class="name">${escapeHTML(data.name)}</div>
        <div class="time">${new Date(data.time.toMillis()).toLocaleString()}</div>
        <p>${escapeHTML(displayText)}</p>
        <div class="post-image" style="background-image: url('${img}');"></div>
    `;

    wall.prepend(post);
}

// Real-time listener for posts
db.collection("posts").orderBy("time", "desc").onSnapshot(snapshot => {
    wall.innerHTML = "";
    snapshot.forEach(doc => renderPost(doc));
});

// Form submission
form.addEventListener("submit", async e => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    const isAnonymous = anonCheckbox.checked;
    const nameValue = nameInput.value.trim();

    if (!isAnonymous && !nameValue) {
        alert("Please enter your name or check 'Post as Anonymous'");
        return;
    }

    const postData = {
        name: isAnonymous ? "~Anon <3" : nameValue,
        text: text,
        isAnonymous: isAnonymous,
        showMessage: isAnonymous ? true : false, // named messages are censored
        avatar: isAnonymous ? images[Math.floor(Math.random() * images.length)] : null,
        time: firebase.firestore.Timestamp.now()
    };

    try {
        await db.collection("posts").add(postData);
        form.reset();
        anonCheckbox.checked = false;
        nameInput.disabled = false;
    } catch(err) {
        console.error("Error posting message:", err);
    }
});
