const fp = require("lodash/fp");
const { Maybe, Container } = require("./support");

// 练习1
let maybe = Maybe.of([5, 6, 1]);
let ex1 = (num) => {
  return maybe.map(fp.map(fp.add(num)));
};
console.log(ex1(1));

// 练习2
let xs = Container.of(["do", "ray", "me", "fa", "so", "la", "ti", "do"]);
let ex2 = () => {
  return xs.map(fp.first);
};
console.log(ex2());

// 练习3
let safeProp = fp.curry(function (x, o) {
  return Maybe.of(o[x]);
});
let user = { id: 2, name: "Albert" };
let ex3 = () => {
  return safeProp("name", user).map(fp.first);
};
console.log(ex3());

// 练习4
let ex4 = function (n) {
  try {
    return Maybe.of(parseInt(n));
  } catch (e) {
    return Maybe.of(null);
  }
};
console.log(ex4("2"));
