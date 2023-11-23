'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Thanachart Saejueng',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-11-20T23:36:17.929Z',
    '2023-11-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Pornkamon Pimpasri',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-11-05T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Chanon Jampa',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-11-20T23:36:17.929Z',
    '2023-11-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Anucha Singha',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-11-20T23:36:17.929Z',
    '2023-11-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

//------Combinding all account into one array------
const accounts = [account1, account2, account3, account4];

//------All Element DOM------
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

//------All Body/Container DOM------
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

//------All button DOM------
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

//------All Input DOM------
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//------Setup Date Movement Func------
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

//------Display Movement Func------
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // foreach date from account
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    // preparing HTML text/logic before using with .insetAdjacentHTML
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;
    // forEach Method will be adding in HTML, at the top of element (afterbegin), if using (beforeend) it will adding in HTML, at the bottom of element
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//------Calculate Display Balance Func------
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

//------Calculate Display Summary Func------
const calcDisplaySummary = function (acc) {
  // Income => total deposit
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  // Outcome => total withdrawal
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  // Interest => total deposit * 1.2%
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1; // Bank rules: Interest totally included only 1 at lease.
    })
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//------create .username foreach owner Func------
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner // add .username that stand for the fullname of each .owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

//------Combind update all UI into one function------
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

//------Login Button------
// Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submiiting (prevent reloading)
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Using ? for optional chaining, if data does not existed, it will skip instead
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100; // 100 = display, 0 = hide

    // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0); // Due to Zerobase, need to + 1
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

//------Transfer Button------
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

//------Loan Button------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // Using Math.floor to rounding down all decimal path when loan the money from the bank
  const amount = Math.floor(inputLoanAmount.value);
  // Any deposit > 10% of request
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  // Reload
  inputLoanAmount.value = '';
});

//------Close Button------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin?.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    // Logout user
  }
  // Reload
  inputCloseUsername.value = inputClosePin.value = '';
});

//------Sort Button------
// Declared let variable to trigger true/false of sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // sorting set to true, when click btnSort
  displayMovements(currentAccount, !sorted);
  // trigger back to false
  sorted = !sorted;
});
