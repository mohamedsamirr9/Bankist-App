'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-26T21:31:17.178Z',
    '2022-11-25T07:42:02.383Z',
    '2022-11-20T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-11-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2022-11-25T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//format date
const formatDate = function (date) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs((date1 - date2) / (24 * 60 * 60 * 1000)));
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `YesterDay`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return Intl.DateTimeFormat('en-us').format(date);
};

//format currency
const formatCurr = function (value, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice(0).sort((a, b) => a - b)
    : acc.movements;
  console.log(movs);
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const formatedDate = formatDate(date);
    const formatedCurrency = formatCurr(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${formatedDate}</div>
      <div class="movements__value">${formatedCurrency}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
//Balance
const calcDisplayBalance = function (account) {
  account.blance = account.movements.reduce((acc, curr) => (acc += curr), 0);
  labelBalance.textContent = `${formatCurr(
    account.blance,
    account.locale,
    account.currency
  )}`;
};

//Summary
const calcDisplaySummary = function (acc) {
  //income
  const income = acc.movements
    .filter(move => move > 0)
    .reduce((acc, curr) => (acc += curr));
  labelSumIn.textContent = `${formatCurr(income, acc.locale, acc.currency)}`;
  //outcome
  const outcome = acc.movements
    .filter(move => move < 0)
    .reduce((acc, curr) => (acc += curr));
  labelSumOut.textContent = `${formatCurr(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  )}`;
  //interset
  const interset = acc.movements
    .filter(move => move > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter(inter => inter >= 1)
    .reduce((acc, inter) => (acc += inter));
  labelSumInterest.textContent = `${formatCurr(
    interset,
    acc.locale,
    acc.currency
  )}`;
};

//createUserName
const createUserName = function (accounts) {
  accounts.forEach(function (current) {
    current.username = current.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserName(accounts);

//updateUi
const updateUi = function (acc) {
  //displayMovents
  displayMovements(acc);
  //displayBlance
  calcDisplayBalance(acc);
  //displaySummary
  calcDisplaySummary(acc);
};

//logOut
const logOut = function () {
  //initaal time for logOut
  let time = 300;
  const tick = function () {
    const min = `${Math.trunc(time / 60)}`.padStart(2, '0');
    const sec = `${time % 60}`.padStart(2, '0');
    //in each call, print the reamining time
    labelTimer.textContent = `${min}:${sec}`;
    //when 0 stop timer and log out
    if (time === 0) {
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Log in to get started';
      clearInterval(timer);
    } else {
      time--;
    }
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Login
let current, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  current = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (current?.pin === Number(inputLoginPin.value)) {
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    //display container
    containerApp.style.opacity = '1';
    //Welcome
    labelWelcome.textContent = `Welcome ${current.owner.split(' ')[0]}`;
    //timer for logout
    //if exist clear it
    if (timer) clearInterval(timer);
    timer = logOut();
    //Date
    const options = {
      minute: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const date = new Date();
    labelDate.textContent = new Intl.DateTimeFormat('en-us', options).format(
      date
    );
    //updateUi
    updateUi(current);
  }
});

//TransferMoney
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (reciever && current.blance >= amount && reciever != current.username) {
    // Doing the transfer And Date
    current.movements.push(-amount);
    current.movementsDates.push(new Date().toISOString());

    reciever.movements.push(amount);
    reciever.movementsDates.push(new Date().toISOString());
    //updateUi
    updateUi(current);
    //Reset timer
    clearInterval(timer);
    timer = logOut();
  }
});

//Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  //time until loan acceopt
  setTimeout(function () {
    //add loan
    if (amount > 0 && current.movements.some(mov => mov >= amount * 0.1))
      current.movements.push(amount);
    //Add Date
    current.movementsDates.push(new Date().toISOString());
    //updateUi
    updateUi(current);
  }, 3000);
  //Reset timer
  clearInterval(timer);
  timer = logOut();
});

//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    current.username === inputCloseUsername.value &&
    current.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    //hide container
    containerApp.style.opacity = '0';
    //Welcome
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Sort
let sortState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(current, !sortState);
  sortState = !sortState;
});
