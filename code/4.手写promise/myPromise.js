const PENDING = "pending";
const FULFILLED = "fufilled";
const REJECTED = "rejected";

function isPromise(object) {
  return object instanceof MyPromise;
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if (isPromise(x)) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}

class MyPromise {
  constructor(executor) {
    // 执行器立即执行
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  // promise状态
  status = PENDING;
  // 成功回调的参数
  data = undefined;
  // 失败回调的参数
  reason = undefined;
  // 成功的回调
  succeedCallback = [];
  // 失败的回调
  failedCallback = [];
  resolve = (d) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.data = d;
    // 异步的情况
    while (this.succeedCallback.length) {
      this.succeedCallback.shift()();
    }
  };
  reject = (e) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = e;
    // 异步的情况
    while (this.failedCallback.length) {
      this.failedCallback.shift()();
    }
  };
  then(succeedCallback, failedCallback) {
    succeedCallback = succeedCallback || ((v) => v);
    failedCallback =
      failedCallback ||
      ((v) => {
        throw v;
      });
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = succeedCallback(this.data);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = failedCallback(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // 当status为pending的时候为异步情况,需要缓存回调
        this.succeedCallback.push(() => {
          setTimeout(() => {
            try {
              const x = succeedCallback(this.data);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.failedCallback.push(() => {
          setTimeout(() => {
            try {
              const x = failedCallback(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  finally(callback) {
    // 统一转为promise来处理
    return MyPromise.resolve(callback()).then(() => {
      return this.then();
    });
  }
  catch(callback) {
    this.then(undefined, callback);
  }
  static resolve(data) {
    if (isPromise(data)) {
      return data;
    }
    return new MyPromise((resolve) => resolve(data));
  }
  static all(arr) {
    let promise = new MyPromise((resolve, reject) => {
      let result = [];
      // 完成了多少
      let finished = 0;
      function setData(value, index) {
        result[index] = value;
        finished++;
        if (finished === arr.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < arr.length; i++) {
        let current = arr[i];
        if (isPromise(current)) {
          current.then(
            (data) => {
              setData(data, i);
            },
            (e) => {
              reject(e);
            }
          );
        } else {
          setData(current, i);
        }
      }
    });

    return promise;
  }
  static race(arr) {
    let promise = new MyPromise((resolve, reject) => {
      for (let i = 0; i < arr.length; i++) {
        let current = arr[i];
        if (isPromise(current)) {
          current.then(
            (data) => {
              resolve(data);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          resolve(current);
        }
      }
    });
    return promise;
  }
}

module.exports = MyPromise;
