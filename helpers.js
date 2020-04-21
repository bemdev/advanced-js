const getNamesAndSymbols = object => {
    const names = Object.getOwnPropertyNames(object);
    const symbols = Object.getOwnPropertySymbols(object);
    return [...names, ...symbols];
};

class mySet {
    constructor(values) {
        this._storage = this._saveValuesToStorage(values);
        this[Symbol.iterator] = () => {
            const arr = Object.values(this._storage);
            let current = 0;
            let last = arr.length;

            return {
                next: () => {
                    if (current !== last) {
                        return {
                            done: false,
                            value: arr[current++],
                        };
                    }

                    return {
                        done: true,
                    };
                },
            };
        };
    }

    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }

    get size() {
        return Object.keys(this._storage).length;
    }

    entries() {
        return Object.entries(this._storage);
    }

    values() {
        return Object.values(this._storage);
    }

    keys() {
        return Object.values(this._storage);
    }

    clear() {
        this._storage = {};
    }

    add(item) {
        this._storage[this._hashCode(item)] = item;
    }

    has(item) {
        return !!this._storage[this._hashCode(item)];
    }

    delete(item) {
        delete this._storage[this._hashCode(item)];
    }

    _saveValuesToStorage(values) {
        return values.reduce((acc, v) => {
            acc[this._hashCode(v)] = v;
            return acc;
        }, {});
    }

    _hashCode(code) {
        const s = JSON.stringify(code);

        let h;
        for (let i = 0; i < s.length; i++)
            h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

        return Math.abs(h);
    }
}

module.exports = {
    getNamesAndSymbols: getNamesAndSymbols,
    mySet: mySet,
};
