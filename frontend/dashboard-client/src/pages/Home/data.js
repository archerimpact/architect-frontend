'use strict';

export default {
    name: 'Projects',
    toggled: true,
    children: [
        {
            name: 'Project 1 Folder',
            children: [
                { name: 'canvas' },
                { name: 'sources' },
                { name: 'index.html' },
                { name: 'styles.js' },
                { name: 'webpack.config.js' }
            ]
        },
        {
            name: 'Project 2 Folder',
            loading: true,
            children: []
        },
        {
            name: 'Project 3 Folder',
            children: [
                {
                    name: 'components',
                    children: [
                        { name: 'decorators.js' },
                        { name: 'treebeard.js' }
                    ]
                },
                { name: 'index.js' }
            ]
        },
        {
            name: 'Project 4 Folder',
            children: [
                { name: 'animations.js' },
                { name: 'default.js' }
            ]
        },
        { name: 'random.txt' },
    ]
};