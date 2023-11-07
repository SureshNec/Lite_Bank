"use strict";

// Data
const account1 = {
  owner: "John Schwarzenegger",
  movements: [200.89, 450.56, -400, 3000.38, -650.15, -130.06, 70, 1300.12],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jenny David",
  movements: [5000.46, 3400.13, -150.76, -790, -3210.25, -1000.14, 8500, -30.56],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Santhosh Thomas Willson",
  movements: [200.55, -200.78, 340.37, -300.51, -20, 50.16, 400.05, -460.18],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Suresh Sanjeev",
  movements: [430.19, 1000.64, 700.98, 50.33, 90.77],
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
const displayMovements = function (accnt, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? accnt.movements.slice().sort((a, b) => a - b) : accnt.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "Withdrawl";
    const color = mov > 0 ? "success" : "danger";

    const date = new Date(accnt.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`;

    const html = `<div class="d-flex flex-lg-row justify-content-between py-3 px-3 border-bottom">
    <div class='d-flex flex-row justify-content-between w-50'>
    <p class="text-white bg-${color} bg-gradient bg-opacity-75  px-4 rounded-pill ">
     ${type}
    </p>
    <p class="movements__date text-body-tertiary ">${displayDate}</p>
    </div>
    <p class="text-secondary fw-semibold "> ${mov.toFixed(2)} $</p>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//Calc Current Balance
const calcDisplayBalance = (accnt) => {
  accnt.balance = accnt.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${accnt.balance.toFixed(2)} $`;
};

// Calc Incomes,Outs and Interest
const calcDisplaySummary = (acnt) => {
  const incomes = acnt.movements.filter((mov) => mov > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} $`;
  const out = acnt.movements.filter((mov) => mov < 0).reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} $`;
  const interst = acnt.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acnt.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${Math.round(interst).toFixed(2)} $`;
};

//Sort
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccnt, !sorted);
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
  displayMovements(accnt);
  //Display Balance
  calcDisplayBalance(accnt);
  //Display Summary
  calcDisplaySummary(accnt);
};

//Login feature
let currentAccnt;

//Fake Login
// currentAccnt = account1;
// updateUI(currentAccnt);
// containerApp.classList.remove("visibility");
///////////////////////////////////////////////////////////////

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccnt = accounts.find((user) => user.username === inputLoginUsername.value);

  if (currentAccnt?.pin === Number(inputLoginPin.value)) {
    //removeUI
    btnlogOut.classList.remove("display");
    loginForm.classList.add("display", "visibility");
    loginToogle.classList.add("display");

    //Creating Dates
    const now = new Date();

    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

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

    //Adding dates to transcation
    currentAccnt.movementsDates.push(new Date().toISOString());
    receiverAccnt.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccnt);
  }
});

//Loan Request
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccnt.movements.some((momts) => momts >= amount * 0.1)) {
    //Clear Input Fields
    inputLoanAmount.value = "";
    inputLoanAmount.blur();

    //Add Loan
    currentAccnt.movements.push(amount);

    //Adding dates to transcation
    currentAccnt.movementsDates.push(new Date().toISOString());

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
const arr3 = [5, 7, 9, 8, 4, 6, 8, 9, 6, 3, 1, 4];
console.log(arr3.reverse());
