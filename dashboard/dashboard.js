// CHECK SESSION
if (!localStorage.getItem("logged")) {
  // Redirect dynamically based on the current domain
  window.location.href = `${window.location.origin}/login/`;
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

// LOGOUT
function handleLogout() {
  localStorage.removeItem("logged");
  // Redirect dynamically to home page
  window.location.href = `${window.location.origin}/`;
}

// HYDRATE DATA
function hydrateData() {
  const logged = JSON.parse(localStorage.getItem("logged"));
  console.log(logged.belajar);

  // Update navigation title
  document.getElementById(
    "navigation-title"
  ).innerText = `Hai, ${logged.username}!`;

  // Display the learning sections if the status is true
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
