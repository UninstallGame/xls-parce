const path = require('path');
const miniCss = require('mini-css-extract-plugin');

module.exports = [
    {
        entry: './script/index.ts',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
        }
    },
    {
        entry: './style/index.scss',
        module: {
            rules: [
                {
                    test: /\.(s*)css$/,
                    use: [
                        miniCss.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.css', '.scss'],
        },
        plugins: [
            new miniCss({
                filename: 'style.css',
            }),
        ]
    },
];
