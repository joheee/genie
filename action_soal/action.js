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

    // console.log("Users:", users);
    // console.log("Questions:", questions);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
loadData();

// HANDLE OPTION
document.addEventListener("DOMContentLoaded", () => {
  const questions = JSON.parse(localStorage.getItem("questions"));
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get("key");
  const current = urlParams.get("current");
  let benar = urlParams.get("benar");

  const currentQuestion = questions[key][current];
  console.log(currentQuestion);
  // Define correct answer index (0 or 1)
  const correctAnswerIndex = currentQuestion.right;

  // CURRENT LOGGED
  const logged = JSON.parse(localStorage.getItem("logged"));
  const users = JSON.parse(localStorage.getItem("users"));

  const nomor = document.getElementById("nomor");
  nomor.innerText = `${parseInt(current) + 1}/${logged.belajar[key].total}`;

  const pertanyaan = document.getElementById("pertanyaan");
  pertanyaan.innerText = currentQuestion.question;

  const pilihan1 = document.getElementById("pilihan_1");
  const pilihan2 = document.getElementById("pilihan_2");
  pilihan1.innerText = currentQuestion.options[0];
  pilihan2.innerText = currentQuestion.options[1];

  // Initially hide result messages
  const benarMessage = document.getElementById("benar");
  const salahMessage = document.getElementById("salah");
  benarMessage.style.display = "none";
  salahMessage.style.display = "none";

  // Initially hide next and finish button
  const nextButton = document.getElementById("next");
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `http://localhost:5500/action_soal/?key=${key}&current=${
      parseInt(current) + 1
    }&benar=${benar}`;
  });
  nextButton.style.display = "none";

  console.log(logged.belajar[key]);
  const finishButton = document.getElementById("finish");
  finishButton.addEventListener("click", (e) => {
    e.preventDefault();
    logged.belajar[key].status = true;
    logged.belajar[key].benar = benar;
    console.log(logged.belajar[key]);
    localStorage.setItem("logged", JSON.stringify(logged));

    users.forEach((u) => {
      if (u.username === logged.username) {
        u = logged;
        console.log(u);
      }
    });

    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "http://localhost:5500/dashboard";
  });
  finishButton.style.display = "none";

  // Handle the form submission
  const checkButton = document.getElementById("check");
  checkButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission

    // Get the selected answer based on the "selected" class
    const selectedAnswerIndex = pilihan1.classList.contains("selected")
      ? 0
      : pilihan2.classList.contains("selected")
      ? 1
      : null;

    if (selectedAnswerIndex === null) {
      alert("Please select an answer!");
      return;
    }

    // Check if the selected answer matches the correct answer index
    const isCorrect = selectedAnswerIndex === correctAnswerIndex;
    isCorrect ? benar++ : benar;

    // Display the correct or incorrect message
    benarMessage.style.display = isCorrect ? "block" : "none";
    salahMessage.style.display = isCorrect ? "none" : "block";

    salahMessage.innerText = `Jawaban yang benar adalah pilihan ke-${
      parseInt(currentQuestion.right) + 1
    }, ${currentQuestion.options[currentQuestion.right]}`;

    checkButton.style.display = "none";

    // already finish
    if (parseInt(current) + 1 === parseInt(logged.belajar[key].total)) {
      finishButton.style.display = "block";
      return;
    }
    nextButton.style.display = "block";
  });

  // Allow selection of answers (toggle selected class)
  pilihan1.addEventListener("click", () => {
    pilihan1.classList.add("selected");
    pilihan2.classList.remove("selected");
  });

  pilihan2.addEventListener("click", () => {
    pilihan2.classList.add("selected");
    pilihan1.classList.remove("selected");
  });
});
