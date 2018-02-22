'use strict';

export default {
    toggle: ({node: {toggled}}) => ({
        animation: {rotateZ: toggled ? 90 : 0},
        duration: 200
    }),
    drawer: (/* props */) => ({
        enter: {
            animation: 'slideDown',
            duration: 200
        },
        leave: {
            animation: 'slideUp',
            duration: 200
        }
    })
};