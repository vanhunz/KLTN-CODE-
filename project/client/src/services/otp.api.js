const API_BASE_URL = 'http://localhost:3000/api/otp';

async function requestOtp(path, payload) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	let result = null;

	try {
		result = await response.json();
	} catch {
		result = null;
	}

	if (!response.ok || !result?.success) {
		throw new Error(result?.message || 'Yêu cầu thất bại');
	}

	return result;
}

export const otpApi = {
	sendOtp: (email) => requestOtp('/send-otp', { email }),
	register: (payload) => requestOtp('/register', payload),
	forgotPassword: (email) => requestOtp('/forgot-password', { email }),
	resetPassword: (payload) => requestOtp('/reset-password', payload),
};
