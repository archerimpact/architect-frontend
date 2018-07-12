"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeDeepCopy = makeDeepCopy;
exports.arraySwap = arraySwap;
function makeDeepCopy(array) {
    var newArray = [];
    array.map(function (object) {
        return newArray.push(Object.assign({}, object));
    });
    return newArray;
}

function arraySwap(arr, from, to) {
    var newArr = makeDeepCopy(arr);
    newArr.splice(to, 0, newArr.splice(from, 1)[0]);
    return newArr;
}