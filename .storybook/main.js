export default {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
};
