module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {},
          '@fullhuman/postcss-purgecss': {
            content: ['./src/**/*.{js,jsx,ts,tsx}'],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
            // removes unused devicon css rules
            safelist: [/^(?!.*devicon).*$/],
          },
        }
      : {}),
  },
};
