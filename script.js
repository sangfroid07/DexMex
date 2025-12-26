// 🔥 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBbVHB-sjFqGDvpYiRTof8zdqF6oVEfYxo",
    authDomain: "dexxer-43e55.firebaseapp.com",
    projectId: "dexxer-43e55",
    storageBucket: "dexxer-43e55.appspot.com",
    messagingSenderId: "80900359866",
    appId: "1:80900359866:web:818425eff775c7f55fe483"
};

fire.ase.initializ(pp(firebaseCon);
const db = firebase.firestore();

// DOM
const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const anon = document.getElementById("anonymous");
const wall = document.getElementById("wall");

// LISTEN FOR POSTS
db.collection("posts").orderBy("time", "desc").onSnapshot(snapshot => {
    wall.innerHTML = ""; // clear wall
    snapshot.forEach(doc => {
        const data = doc.data();

        const post = document.createElement("div");
        post.classList.add("post-textbox");

        // If message is censored (for named users)
        let text = data.censored ? "*".repeat(data.text.length) : data.text;

        post.innerHTML = `
            <div class="name">${data.name}</div>
            <div class="time">${new Date(data.time.toMillis()).toLocaleString()}</div>
            <p>${text}</p>
        `;

        wall.appendChild(post);
    });
});

// SUBMIT FORM
form.addEventListener("submit", async e => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    let name, censored;
    if (anon.checked) {
        name = "~Anon <3";
        censored = false; // anonymous posts are shown normally
    } else {
        name = nameInput.value.trim();
        if (!name) {
            alert("Please enter your name or check 'Post as Anonymous'");
            return;
        }
        censored = true; // named users get their message censored
    }

    await db.collection("posts").add({
        name,
        text,
        censored,
        time: firebase.firestore.Timestamp.now()
    });

    form.reset();
    anon.checked = false;
});
