require('dotenv').config();

const app = require('./src/app.js');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server dang chay tai http://localhost:${port}`);
});
