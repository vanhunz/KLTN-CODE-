import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { otpApi } from '../services/otp.api';

export default function ForgotPassword() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1); // 1: gửi email, 2: reset password
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [otpTimer, setOtpTimer] = useState(0);

	// Step 1: Gửi OTP
	const handleSendOtp = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);

		try {
			// Validate email
			if (!email.trim()) {
				setError('Vui lòng nhập email');
				setLoading(false);
				return;
			}

			const emailRegex = /.+@.+\..+/;
			if (!emailRegex.test(email)) {
				setError('Email không hợp lệ');
				setLoading(false);
				return;
			}

			// Gửi OTP
			const result = await otpApi.forgotPassword(email);
			setSuccess(result.message || 'OTP đã được gửi tới email của bạn');
			setStep(2);
			setOtpTimer(300); // 5 phút = 300 giây

			// Countdown timer
			const interval = setInterval(() => {
				setOtpTimer((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} catch (err) {
			setError(err.message || 'Lỗi khi gửi OTP');
		} finally {
			setLoading(false);
		}
	};

	// Step 2: Reset password
	const handleResetPassword = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);

		try {
			// Validate
			if (!otp.trim()) {
				setError('Vui lòng nhập OTP');
				setLoading(false);
				return;
			}

			if (!/^\d{6}$/.test(otp)) {
				setError('OTP phải là 6 số');
				setLoading(false);
				return;
			}

			if (!newPassword || newPassword.length < 6) {
				setError('Mật khẩu phải có ít nhất 6 ký tự');
				setLoading(false);
				return;
			}

			if (newPassword !== confirmPassword) {
				setError('Mật khẩu xác nhận không khớp');
				setLoading(false);
				return;
			}

			// Reset password
			const result = await otpApi.resetPassword({
				email,
				otp,
				newPassword,
			});

			setSuccess(result.message || 'Đặt lại mật khẩu thành công!');

			// Chuyển về trang login sau 2 giây
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (err) {
			setError(err.message || 'Lỗi khi đặt lại mật khẩu');
		} finally {
			setLoading(false);
		}
	};

	// Format timer
	const formatTimer = () => {
		const minutes = Math.floor(otpTimer / 60);
		const seconds = otpTimer % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
				<h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
					Quên mật khẩu?
				</h1>
				<p className="text-center text-gray-600 mb-8">
					{step === 1
						? 'Nhập email để nhận mã xác thực'
						: 'Nhập OTP và mật khẩu mới'}
				</p>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				{success && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
						{success}
					</div>
				)}

				{step === 1 ? (
					<form onSubmit={handleSendOtp} className="space-y-4">
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="your@email.com"
								disabled={loading}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
						>
							{loading ? 'Đang gửi...' : 'Gửi OTP'}
						</button>
					</form>
				) : (
					<form onSubmit={handleResetPassword} className="space-y-4">
						<div>
							<div className="flex justify-between mb-2">
								<label className="block text-gray-700 font-semibold">OTP</label>
								<span className="text-sm text-red-600 font-semibold">
									{otpTimer > 0 ? `Hết hạn trong: ${formatTimer()}` : 'OTP hết hạn'}
								</span>
							</div>
							<input
								type="text"
								value={otp}
								onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
								placeholder="000000"
								maxLength="6"
								disabled={loading}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-center text-2xl tracking-widest"
							/>
							<p className="text-xs text-gray-500 mt-1">Kiểm tra email để lấy OTP</p>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Mật khẩu mới
							</label>
							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="••••••"
								disabled={loading}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
							/>
							<p className="text-xs text-gray-500 mt-1">Ít nhất 6 ký tự</p>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Xác nhận mật khẩu
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="••••••"
								disabled={loading}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
							/>
						</div>

						<button
							type="submit"
							disabled={loading || otpTimer === 0}
							className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
						>
							{loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
						</button>

						<button
							type="button"
							onClick={() => {
								setStep(1);
								setOtp('');
								setNewPassword('');
								setConfirmPassword('');
								setOtpTimer(0);
								setError('');
								setSuccess('');
							}}
							className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
						>
							Quay lại
						</button>
					</form>
				)}

				<div className="mt-6 text-center">
					<p className="text-gray-600">
						Nhớ mật khẩu?{' '}
						<button
							onClick={() => navigate('/login')}
							className="text-blue-600 font-semibold hover:underline"
						>
							Đăng nhập
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
