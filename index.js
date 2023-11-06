"use strict";

// Data
const account1 = {
  owner: "John Schwarzenegger",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jenny David",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Santhosh Thomas Willson",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Suresh Sanjeev",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const loginForm = document.querySelector(".loginForm");
const loginToogle = document.querySelector(".loginToogle");
const btnlogOut = document.querySelector(".logout__btn");
/////////////////////////////////////////////////

//Display Movements in HTML
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "Withdrawl";
    const color = mov > 0 ? "success" : "danger";

    const html = `<div class="d-flex flex-lg-row justify-content-between py-3 px-3 border-bottom">
    <p class="text-white bg-${color} bg-gradient bg-opacity-75  px-4 rounded-pill ">
     ${type}
    </p>
    <!-- <p class="movements__date text-body-tertiary">3 days ago</p> -->
    <p class="text-secondary fw-semibold "> ${mov} $</p>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//Calc Current Balance
const calcDisplayBalance = (accnt) => {
  accnt.balance = accnt.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${accnt.balance} $`;
};

// Calc Incomes,Outs and Interest
const calcDisplaySummary = (acnt) => {
  const incomes = acnt.movements.filter((mov) => mov > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes} $`;
  const out = acnt.movements.filter((mov) => mov < 0).reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)} $`;
  const interst = acnt.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acnt.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${Math.round(interst)} $`;
};

//Sort
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccnt.movements, !sorted);
  sorted = !sorted;
});

//Create Usernames
const createUsernames = (accts) => {
  accts.forEach((acnt) => {
    acnt.username = acnt.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

accounts.forEach((acnt) => {
  console.log(`Username: ${acnt.username} | Password: ${acnt.pin}`);
});

//Updating User Interface
const updateUI = (accnt) => {
  //Display Movements
  displayMovements(accnt.movements);
  //Display Balance
  calcDisplayBalance(accnt);
  //Display Summary
  calcDisplaySummary(accnt);
};

//Login feature
let currentAccnt;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccnt = accounts.find((user) => user.username === inputLoginUsername.value);

  if (currentAccnt?.pin === Number(inputLoginPin.value)) {
    //removeUI
    btnlogOut.classList.remove("display");
    loginForm.classList.add("display", "visibility");
    loginToogle.classList.add("display");
    //Display UI
    labelWelcome.textContent = `Welcome back, ${currentAccnt.owner.split(" ")[0]}`;
    containerApp.classList.remove("visibility");

    //Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputClosePin.blur();

    //Update UI
    updateUI(currentAccnt);

    console.log(accounts);
  } else {
    labelWelcome.textContent = `Invalid Credentials`;
  }
});

// LogOut feature
btnlogOut.addEventListener("click", (e) => {
  e.preventDefault();
  //Add UI
  labelWelcome.textContent = `Log in to get started`;
  containerApp.classList.add("visibility");
  btnlogOut.classList.add("display");
  loginForm.classList.remove("display", "visibility");
  loginToogle.classList.remove("display");
});

//Transfer Money
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccnt = accounts.find((accnt) => accnt.username === inputTransferTo.value);

  //Clear Input Fields
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  if (amount > 0 && currentAccnt.balance >= amount && receiverAccnt && receiverAccnt?.username !== currentAccnt.username) {
    //Initiating Transfer
    currentAccnt.movements.push(-amount);
    receiverAccnt.movements.push(amount);
    //Update UI
    updateUI(currentAccnt);
  }
});

//Loan Request
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccnt.movements.some((momts) => momts >= amount * 0.1)) {
    //Clear Input Fields
    inputLoanAmount.value = "";
    inputLoanAmount.blur();

    //Add Loan
    currentAccnt.movements.push(amount);

    //Update UI
    updateUI(currentAccnt);
  }
});

//Close Account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccnt.username && Number(inputClosePin.value) === currentAccnt.pin) {
    const index = accounts.findIndex((accnt) => accnt.username === currentAccnt.username);

    //Clear Input Fields
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();

    //delete user
    accounts.splice(index, 1); //1 indicates 1 user

    //Display UI
    labelWelcome.textContent = `Log in to get started`;
    containerApp.classList.add("visibility");
    btnlogOut.classList.add("display");
    loginForm.classList.remove("display", "visibility");
    loginToogle.classList.remove("display");

    console.log(accounts);
  }
});

/////////////////////////////////////////////////
const arr = ["a", "b", "c", "e", "d", "f"];
const arr2 = ["suresh", "ramesh", "mukesh"];
