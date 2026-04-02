const API_BASE_URL = 'http://localhost:3000/api/users';

async function requestWithAuth(path, method, payload, token) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: payload ? JSON.stringify(payload) : undefined,
	});

	let result = null;
	try {
		result = await response.json();
	} catch {
		result = null;
	}

	if (!response.ok || !result?.success) {
		throw new Error(result?.message || 'Yeu cau that bai');
	}

	return result.data || null;
}

export const userApi = {
	getMe: (token) => requestWithAuth('/me', 'GET', null, token),
	updateMe: (payload, token) => requestWithAuth('/me', 'PUT', payload, token),
	changePassword: (payload, token) => requestWithAuth('/me/password', 'PUT', payload, token),
};
