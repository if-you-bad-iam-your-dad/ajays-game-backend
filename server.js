const dotenv = require('dotenv');
const path = require('path');

// Initialize environment variables
dotenv.config({ path: path.resolve(__dirname, './.env') });

const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Local network access: http://<your-local-ip>:${PORT}`);
});
