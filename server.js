const dotenv = require('dotenv');
const path = require('path');

// Initialize environment variables
dotenv.config({ path: path.resolve(__dirname, './.env') });

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
