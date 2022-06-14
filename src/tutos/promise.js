// create/declare a promise:
const letPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve("pass");
    reject("fail");
  }, 2000);
});
// call a promise
letPromise
  .then((result) => {
    console.log("success", result);
  })
  .catch((error) => {
    console.log("failed", error);
  });

/* -------------------------------------------------------------------------- */

//declaring and calling function instantly.
(function trial(){
    console.log('prnt function')
})();

/* -------------------------------------------------------------------------- */

// creating promise
//(with argument: in this case create a function that returns a promise)
const promiseArgument = (arg) =>
  new Promise((resolve, reject) => {
    if (arg > 10) {
      resolve("argument is greater then 10");
    } else {
      reject("argument is less than 10");
    }
  });

// calling promise
promiseArgument(1)
  .then((result) => {
    console.log("success", result);
  })
  .catch((error) => {
    console.log("failed", error);
  });

/* -------------------------------------------------------------------------- */

//.trycatch is for async func [this code-block won't work]
// try {
//   promiseArgument(1);
//   console.log("success", result);
// } catch (error) {
//   console.log("failed", error);
// }

//. trycatch should be done inside an async function.
//.[this is a self executing function]
(async function trycatchPromise(){
try {
 const result= await promiseArgument(12);
  console.log("success", result);
} catch (error) {
  console.log("failed", error);
}
})()
