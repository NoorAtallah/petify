const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        'customGray': '#E8E1DA',
        'bermuda': '#78dcca',
        'brown' : '#967D6C',
        'green' : '#00D1BD',
        'light' : '#F6F3F0'
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}
