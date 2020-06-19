const fp = require("lodash/fp");

const cars = [
  { name: "Ferrari ff", horsepower: 600, dollar_value: 700000, in_stock: true },
  {
    name: "Spyker c12 Zagato",
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false,
  },
  {
    name: "Jaguar XKR-S",
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false,
  },
  {
    name: "Audi R8",
    horsepower: 525,
    dollar_value: 114200,
    in_stock: false,
  },
  {
    name: "Aston Martin One-77",
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true,
  },
  {
    name: "APagani Huayra",
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false,
  },
];

// 练习一
const isLastInStock = fp.flowRight(fp.prop("in_stock"), fp.last);
console.log(isLastInStock(cars));

// 练习二
const isFirstName = fp.flowRight(fp.prop("name"), fp.first);
console.log(isFirstName(cars));

// 练习三
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length;
};

let averageDollarValue = function (cars) {
  return fp.flowRight(
    _average,
    fp.map((v) => v.dollar_value)
  )(cars);
};
console.log(averageDollarValue(cars));

// 练习四
let _underscore = fp.replace(/\W+/g, "_");
let sanitizeNames = function (arr) {
  return fp.flowRight(fp.map((v) => fp.flowRight(_underscore, fp.toLower)(v)))(
    arr
  );
};
console.log(sanitizeNames(["Hello World", "Li Ang"]));
