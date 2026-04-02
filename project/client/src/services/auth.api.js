const API_BASE_URL = 'http://localhost:3000/api/auth';

async function requestAuth(path, payload) {
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
		throw new Error(result?.message || 'Yeu cau that bai');
	}

	return result.data;
}

export const authApi = {
	login: (payload) => requestAuth('/login', payload),
	register: (payload) => requestAuth('/register', payload),
};
