async function renderReport(path, elementId) {
  const element = document.getElementById(elementId);
  try {
    element.textContent = JSON.stringify(await api(path), null, 2);
  } catch (error) {
    element.textContent = error.message;
    element.className = "error";
  }
}

renderReport("/reports/animals", "animalReport");
renderReport("/reports/revenue", "revenueReport");
renderReport("/reports/visitors", "visitorReport");
renderReport("/reports/food-requirements", "foodReport");
