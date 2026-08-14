async function loadAnimals() {
  const rows = document.getElementById("animalRows");
  rows.innerHTML = "";
  const animals = await api("/animals");
  for (const animal of animals) {
    rows.insertAdjacentHTML("beforeend", `<tr><td>${animal.name}</td><td>${animal.animalType}</td><td>${animal.healthStatus}</td><td>${animal.foodPerDay}</td></tr>`);
  }
}

document.getElementById("animalForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  data.age = Number(data.age);
  data.weight = Number(data.weight);
  data.isCarnivore = data.isCarnivore === "true";
  data.wingSpan = data.wingSpan ? Number(data.wingSpan) : null;
  data.canFly = data.canFly === "true";
  try {
    await api("/animals", { method: "POST", body: JSON.stringify(data) });
    setMessage("animalMessage", "Animal saved.");
    event.target.reset();
    await loadAnimals();
  } catch (error) {
    setMessage("animalMessage", error.message, true);
  }
});

loadAnimals().catch(error => setMessage("animalMessage", error.message, true));
