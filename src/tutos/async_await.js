/* -------------------------------------------------------------------------- */
/**
 * no return statement will implicitly return "undefined"
 */
const doWork = () => {};
console.log("1", doWork());
/* -------------------------------------------------------------------------- */
/**
 * (async) no return statement will implicitly return
 * "a promise that has been 'resolved' with 'undefined'"
 */
const doWork_async = async () => {};
console.log("2", doWork_async());
/* -------------------------------------------------------------------------- */
/**
 * async functions always returns a promise with the "returned-item"
 * as the "resolved-parameter"
 */
const returnSomething_async = async () => {
  return "resolved-parameter";
};
console.log("3", returnSomething_async());

returnSomething_async()
  .then((data) => {
    console.log("4", data);
  })
  .catch((err) => {
    console.log("4-err", err);
  });

/* -------------------------------------------------------------------------- */
/**
 * use of 'await' inside an async function
 */
const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject("number should be a non-negative number");
      }
      resolve(a + b);
    }, 2000);
  });
};

// IIFE
const value = async () => {
  const sum = await add(1, 2);
  const sum2 = await add(sum, 5);
  /**
   * any rejection in any await will result in rejection of the whole function.
   * This gets rejected due to the "3rd" await statement.
   */
  const sum3 = await add(sum2, -5);
  return sum3;
};

value()
  .then((data) => {
    console.log("5", data);
  })
  .catch((err) => {
    console.log("5-err", err);
  });
