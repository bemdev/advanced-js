const { getNamesAndSymbols } = require('./helpers.js');

// Написать функцию, которая принимает объект и возвращает все свойства и символы как в самом объекте, так и во всей его цепочке прототипов.

function allKeysAndSymbols(object) {
    // реализация
    const namesAndSymbols = getNamesAndSymbols(object);
    const proto = Object.getPrototypeOf(object);

    if (!proto) {
        return [...namesAndSymbols];
    }

    return [...namesAndSymbols, ...allKeysAndSymbols(proto)];
}

console.log(allKeysAndSymbols({})); // ["constructor", "__defineGetter__", "__defineSetter__", "hasOwnProperty", ... ]

// Написать прокси-объект, для которого оператор in вернет истину только в том случает, когда свойство находится в самом объекте, но не в его прототипе.
const proto = { value: 42 };
const object = Object.create(proto);

Object.defineProperty(object, 'year', {
    value: 2020,
    writable: true,
    configurable: true,
    enumerable: false,
});

const symbol = Symbol('bazzinga');
object[symbol] = 42;

// без proxy
console.log('value' in object); // true
console.log('year' in object); // true
console.log(symbol in object); // true

const proxy = (() => {
    const proxyObject = new Proxy(object, {
        has(target, prop) {
            const namesAndSymbols = getNamesAndSymbols(target);
            return namesAndSymbols.includes(prop);
        },
    });

    return proxyObject;
})();

// с proxy
console.log('value' in proxy); // false
console.log('year' in proxy); // true
console.log(symbol in proxy); // true

// Написать функцию, которая позволит использовать внутри генератора асинхронные вызовы.
// Реализация на Promise, async/await использовать запрещено.
function asyncExecutor(generator) {
    // реализация
    const iterator = generator();

    const executor = ({ value, done }) => {
        if (done) {
            return Promise.resolve(value);
        }

        return Promise.resolve(value)
            .then(res => executor(iterator.next(res)))
            .catch(generator.throw);
    };

    return executor(iterator.next());
}

// тесты
const ID = 42;
const delayMS = 1000;

function getId() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(ID);
        }, delayMS);
    });
}

function getDataById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            id === ID ? resolve('🍎') : reject('💥');
        }, delayMS);
    });
}
asyncExecutor(function*() {
    console.time('Time');
    const id = yield getId();
    const data = yield getDataById(id);
    console.log('Data', data);
    console.timeEnd('Time');
});
