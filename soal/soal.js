// CHECK SESSION
if (!localStorage.getItem("logged")) {
  window.location.href = "http://localhost:5500/login";
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

//LOGOUT
function handleLogout() {
  localStorage.removeItem("logged");
  window.location.href = "http://localhost:5500/";
}

//HYDRATE DATA
function hydrateData() {
  const logged = JSON.parse(localStorage.getItem("logged"));
  console.log(logged);

  if(!logged.belajar.PenggunaanHuruf.status) {
    document.getElementById("PenggunaanHuruf").style.display = "block"
  }
  if(!logged.belajar.PenggunaanTandaBaca.status) {
    document.getElementById("PenggunaanTandaBaca").style.display = "block"
  }
  if(!logged.belajar.PenulisanKata.status) {
    document.getElementById("PenulisanKata").style.display = "block"
  }
  if(!logged.belajar.PenggunaanKataSerapan.status) {
    document.getElementById("PenggunaanKataSerapan").style.display = "block"
  }
}
hydrateData();
