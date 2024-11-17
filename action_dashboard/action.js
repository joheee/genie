// CHECK SESSION
if (!localStorage.getItem("logged")) {
  // Redirect dynamically to login page
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
      `${window.location.origin}/data/users.json`
    );
    const questions = await getDataFromLocalStorage(
      "questions",
      `${window.location.origin}/data/questions.json`
    );
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
  let benar = parseInt(urlParams.get("benar")) || 0; // Initialize benar (correct answers count)

  const currentQuestion = questions[key][current];
  const correctAnswerIndex = currentQuestion.right;

  // CURRENT LOGGED USER
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
  nextButton.style.display = "none";

  const finishButton = document.getElementById("finish");
  finishButton.style.display = "none";

  // Next Question button action
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `${window.location.origin}/action_soal/?key=${key}&current=${parseInt(current) + 1}&benar=${benar}`;
  });

  // Finish button action
  finishButton.addEventListener("click", (e) => {
    e.preventDefault();
    logged.belajar[key].status = true;
    logged.belajar[key].benar = benar; // Save correct answers count
    localStorage.setItem("logged", JSON.stringify(logged));

    // Update the user data in users array
    const userIndex = users.findIndex((u) => u.username === logged.username);
    if (userIndex !== -1) {
      users[userIndex] = logged; // Update the logged user
      localStorage.setItem("users", JSON.stringify(users));
    }

    window.location.href = `${window.location.origin}/dashboard/`; // Redirect to dashboard
  });

  // Check button action (check the answer)
  const checkButton = document.getElementById("check");
  checkButton.addEventListener("click", (event) => {
    event.preventDefault();

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
    if (isCorrect) {
      benar++; // Increment the correct answer count
    }

    // Display the correct or incorrect message
    benarMessage.style.display = isCorrect ? "block" : "none";
    salahMessage.style.display = isCorrect ? "none" : "block";

    salahMessage.innerText = `Jawaban yang benar adalah pilihan ke-${parseInt(currentQuestion.right) + 1}, ${currentQuestion.options[currentQuestion.right]}`;

    checkButton.style.display = "none";

    // Check if the quiz is finished
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
