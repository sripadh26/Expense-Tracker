// script.js
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("transaction-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let searchQuery = "";

function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI(getActiveFilter());
}

function getActiveFilter() {
  const activeBtn = document.querySelector(".filter-btn.active");
  return activeBtn ? activeBtn.dataset.type : "all";
}

function addTransaction(name, amt) {
  const transaction = {
    id: Date.now(),
    name,
    amount: amt,
    date: new Date().toISOString().split("T")[0],
  };
  transactions.push(transaction);
  saveAndRender();
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveAndRender();
}

function updateUI(filter = "all") {
  list.innerHTML = "";

  const filtered = transactions.filter((t) => {
    if (filter === "income" && t.amount <= 0) return false;
    if (filter === "expense" && t.amount >= 0) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  filtered.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add("transaction-item");
    if (t.amount < 0) li.classList.add("expense");

    li.innerHTML = `
      <div class="transaction-details">
        <strong>${t.name}</strong>
        <span class="transaction-date">${t.date}</span>
      </div>
      <div class="transaction-right">
        <span class="${t.amount < 0 ? "amount negative" : "amount positive"}">₹${Math.abs(t.amount)}</span>
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

  balanceEl.textContent = `₹${total}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${Math.abs(expense)}`;
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = text.value.trim();
  const amt = parseFloat(amount.value);
  if (!name || isNaN(amt) || amt === 0) {
    alert("Enter valid description and non-zero amount");
    return;
  }
  addTransaction(name, amt);
  text.value = "";
  amount.value = "";
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    updateUI(btn.dataset.type);
  });
});

// NEW: Search by description
searchInput?.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  updateUI(getActiveFilter());
});

updateUI();
