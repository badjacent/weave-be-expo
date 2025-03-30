// babel.config.js
module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@api': './src/api',
              '@components': './src/components',
              '@constants': './src/constants',
              '@hooks': './src/hooks',
              '@screens': './src/screens',
              '@utils': './src/utils',
              // Add other directories as needed
            },
          },
        ],
      ],
    };
  };