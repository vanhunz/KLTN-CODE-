require('dotenv').config();

const app = require('./src/app.js');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');
const userRoutes = require('./src/routes/user.routes');
const otpRoutes = require('./src/routes/otp.routes');
const { verifyEmailConnection } = require('./src/integrations/email');

// Kiểm tra email service
verifyEmailConnection().then((verified) => {
  if (!verified) {
    console.warn('⚠️  Email service không khả dụng. Vui lòng kiểm tra cấu hình.');
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server dang chay tai http://localhost:${port}`);
});
