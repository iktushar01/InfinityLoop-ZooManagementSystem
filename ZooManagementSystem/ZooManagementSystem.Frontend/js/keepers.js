async function loadKeepers() {
  const rows = document.getElementById("keeperRows");
  rows.innerHTML = "";
  const keepers = await api("/keepers");
  for (const keeper of keepers) {
    rows.insertAdjacentHTML("beforeend", `<tr><td>${keeper.name}</td><td>${keeper.email}</td><td>${keeper.assignedAnimals.length}</td></tr>`);
  }
}

document.getElementById("keeperForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  data.age = Number(data.age);
  try {
    await api("/keepers", { method: "POST", body: JSON.stringify(data) });
    setMessage("keeperMessage", "Keeper saved.");
    event.target.reset();
    await loadKeepers();
  } catch (error) {
    setMessage("keeperMessage", error.message, true);
  }
});

loadKeepers().catch(error => setMessage("keeperMessage", error.message, true));
