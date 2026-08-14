async function loadTickets() {
  const rows = document.getElementById("ticketRows");
  rows.innerHTML = "";
  const tickets = await api("/tickets");
  for (const ticket of tickets) {
    rows.insertAdjacentHTML("beforeend", `<tr><td>${ticket.visitorName}</td><td>${ticket.ticketType}</td><td>${ticket.price}</td><td>${ticket.visitDate}</td></tr>`);
  }
}

document.getElementById("ticketForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  data.price = Number(data.price);
  try {
    await api("/tickets", { method: "POST", body: JSON.stringify(data) });
    setMessage("ticketMessage", "Ticket saved.");
    event.target.reset();
    await loadTickets();
  } catch (error) {
    setMessage("ticketMessage", error.message, true);
  }
});

loadTickets().catch(error => setMessage("ticketMessage", error.message, true));
