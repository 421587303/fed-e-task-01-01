new Promise((resolve, reject) => {
  setTimeout(() => {
    var a = "hello";
    resolve(a);
  }, 10);
})
  .then((a) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var b = "lagou";
        resolve(a + b);
      }, 10);
    });
  })
  .then((str) => {
    setTimeout(() => {
      var c = "I ♥️ U";
      console.log(str + c);
    }, 10);
  });
