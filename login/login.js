// CHECK SESSION
if (localStorage.getItem("logged")) {
  // Redirect dynamically based on the current domain
  window.location.href = `${window.location.origin}/dashboard/`;
}

// LOAD DATA
async function getDataFromLocalStorage(key, url) {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    console.log("Data already pushed into localStorage!");
    return JSON.parse(storedData);
  } else {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }
}

async function loadData() {
  try {
    const users = await getDataFromLocalStorage(
      "users",
      `${window.location.origin}/data/users.json`  // Use dynamic domain
    );
    const questions = await getDataFromLocalStorage(
      "questions",
      `${window.location.origin}/data/questions.json`  // Use dynamic domain
    );

    console.log("Users:", users);
    console.log("Questions:", questions);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

loadData();

// TAKE INPUT
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get values from inputs
    const username = document.getElementById("username").value;
    const inputPass = document.getElementById("password").value;

    const users = await getDataFromLocalStorage(
      "users",
      `${window.location.origin}/data/users.json`  // Use dynamic domain
    );

    console.log(users.find((e) => e.username !== username));
    console.log(users.find((e) => e.password !== inputPass));
    
    // validation
    const user = users.find((e) => e.username === username && e.password === inputPass);
    if (!user) {
      alert("Invalid credentials!");
      return;
    }

    localStorage.setItem("logged", JSON.stringify(user));  // Save user data in localStorage without password
    alert(`Hola ${username}!`);
    window.location.href = `${window.location.origin}/dashboard/`;  // Redirect dynamically
  });
});
