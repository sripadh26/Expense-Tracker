const text = document.getElementById("text");
const amount = document.getElementById("amount");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("transaction-list");
const filterBtns = document.querySelectorAll(".filter-btn");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

let transactions = [];

function addTransaction(name, amt) {
  const transaction = {
    id: Date.now(),
    name,
    amount: amt,
    date: new Date().toISOString().split("T")[0],
  };
  transactions.push(transaction);
  updateUI();
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateUI();
}

function updateUI(filter = "all") {
  list.innerHTML = "";

  const filtered = transactions.filter((t) => {
    if (filter === "income") return t.amount > 0;
    if (filter === "expense") return t.amount < 0;
    return true;
  });

  filtered.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add("transaction-item");
    if (t.amount < 0) li.classList.add("expense");

    li.innerHTML = `
      <div>
        <strong>${t.name}</strong><br />
        <span class="transaction-date">${t.date}</span>
      </div>
      <div class="transaction-right">
        <span class="${t.amount < 0 ? "negative" : "positive"}">₹${Math.abs(t.amount)}</span>
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">&times;</button>
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

addBtn.addEventListener("click", () => {
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
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    updateUI(btn.dataset.type);
  });
});

// Initial load
updateUI();
