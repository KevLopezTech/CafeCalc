module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./'], // The root of your project
                    extensions: [
                        '.ios.js',
                        '.android.js',
                        '.js',
                        '.ts',
                        '.tsx',
                        '.json',
                    ],
                    alias: {
                        '@': './', // This makes '@/' refer to the project root.
                                   // This must match the 'paths' configuration in tsconfig.json.
                    },
                },
            ],
            'react-native-reanimated/plugin', // Ensure this is last if you use Reanimated
        ],
    };
};
