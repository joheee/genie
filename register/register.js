// CHECK SESSION
if (localStorage.getItem("logged")) {
  window.location.href = "http://localhost:5500/dashboard";
}
// LOAD DATA
async function getDataFromLocalStorage(key, url) {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    console.log("data already push into localstorage!");
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
      "http://localhost:5500/data/users.json"
    );
    const questions = await getDataFromLocalStorage(
      "questions",
      "http://localhost:5500/data/questions.json"
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
    const email = document.getElementById("email").value;
    const inputPass = document.getElementById("password").value;

    const users = await getDataFromLocalStorage(
      "users",
      "http://localhost:5500/data/users.json"
    );

    // validation
    if (users.find((e) => e.username === username)) {
      alert("username already exist!");
      return;
    }
    if (users.find((e) => e.email === email)) {
      alert("email already exist!");
      return;
    }

    const data = {
      username,
      email,
      password: inputPass,
      belajar: {
        PenggunaanHuruf: {
          status: false,
          benar: 0,
          total: 4,
        },
        PenggunaanTandaBaca: {
          status: false,
          benar: 0,
          total: 5,
        },
        PenulisanKata: {
          status: false,
          benar: 0,
          total: 5,
        },
        PenggunaanKataSerapan: {
          status: false,
          benar: 0,
          total: 5,
        },
      },
    };

    const newUserList = [...users, data];
    localStorage.setItem("users", JSON.stringify(newUserList));

    const { password, ...userWithoutPassword } = data;
    localStorage.setItem("logged", JSON.stringify(userWithoutPassword));
    alert(`Hola ${username}!`);
    window.location.href = "http://localhost:5500/dashboard";
  });
});
