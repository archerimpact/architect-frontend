
export function makeDeepCopy(array) {
    let newArray = [];
    array.map((object) => {
        return newArray.push(Object.assign({}, object));
    });
    return newArray;
}

export function arraySwap(arr, from, to) {
    let newArr = makeDeepCopy(arr);
    newArr.splice(to, 0, newArr.splice(from, 1)[0]);
    return newArr
}