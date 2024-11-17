// CHECK SESSION
if (localStorage.getItem("logged")) {
  // Redirect to the "dashboard" using the current domain
  window.location.href = `${window.location.origin}/dashboard`;
}

// LOAD DATA
async function getDataFromLocalStorage(key, url) {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    console.log("data already pushed into localstorage!");
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
