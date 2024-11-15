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
  console.log(logged.belajar);
  document.getElementById(
    "navigation-title"
  ).innerText = `Hai, ${logged.username}!`;

  if (logged.belajar.PenggunaanHuruf.status) {
    document.getElementById("PenggunaanHuruf").style.display = "block";
    document.getElementById(
      "PenggunaanHuruf_text"
    ).innerText = `Penggunaan Huruf (${logged.belajar["PenggunaanHuruf"].benar}/${logged.belajar["PenggunaanHuruf"].total})`;
  }
  if (logged.belajar.PenggunaanTandaBaca.status) {
    document.getElementById("PenggunaanTandaBaca").style.display = "block";
    document.getElementById(
      "PenggunaanTandaBaca_text"
    ).innerText = `Penggunaan Tanda Baca (${logged.belajar["PenggunaanTandaBaca"].benar}/${logged.belajar["PenggunaanTandaBaca"].total})`;
  }
  if (logged.belajar.PenulisanKata.status) {
    document.getElementById("PenulisanKata").style.display = "block";
    document.getElementById(
      "PenulisanKata_text"
    ).innerText = `Penulisan Kata (${logged.belajar["PenulisanKata"].benar}/${logged.belajar["PenulisanKata"].total})`;
  }
  if (logged.belajar.PenggunaanKataSerapan.status) {
    document.getElementById("PenggunaanKataSerapan").style.display = "block";
    document.getElementById(
      "PenggunaanKataSerapan_text"
    ).innerText = `Penggunaan Kata Serapan (${logged.belajar["PenggunaanKataSerapan"].benar}/${logged.belajar["PenggunaanKataSerapan"].total})`;
  }
}
hydrateData();
