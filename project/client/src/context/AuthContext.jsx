import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/auth.api';
import { userApi } from '../services/user.api';

const AUTH_STORAGE_KEY = 'authData';

const AuthContext = createContext(null);

function readStoredAuth() {
	try {
		return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
	} catch {
		return null;
	}
}

export function AuthProvider({ children }) {
	const [authData, setAuthData] = useState(() => readStoredAuth());

	useEffect(() => {
		if (authData?.token) {
			localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
		} else {
			localStorage.removeItem(AUTH_STORAGE_KEY);
		}
	}, [authData]);

	const value = useMemo(() => {
		const login = async (credentials) => {
			const data = await authApi.login(credentials);
			setAuthData(data);
			return data;
		};

		const register = async (payload) => {
			return authApi.register(payload);
		};

		const refreshProfile = async () => {
			if (!authData?.token) {
				throw new Error('Ban chua dang nhap');
			}
			const data = await userApi.getMe(authData.token);
			setAuthData((current) => ({
				...(current || {}),
				user: data.user,
			}));
			return data;
		};

		const updateProfile = async (payload) => {
			if (!authData?.token) {
				throw new Error('Ban chua dang nhap');
			}

			const data = await userApi.updateMe(payload, authData.token);
			setAuthData((current) => ({
				...(current || {}),
				token: data.token || current?.token,
				user: data.user,
			}));
			return data;
		};

		const changePassword = async (payload) => {
			if (!authData?.token) {
				throw new Error('Ban chua dang nhap');
			}
			return userApi.changePassword(payload, authData.token);
		};

		return {
			authData,
			user: authData?.user || null,
			token: authData?.token || null,
			isAuthenticated: Boolean(authData?.token),
			login,
			register,
			refreshProfile,
			updateProfile,
			changePassword,
			setAuthData,
			clearAuth: () => setAuthData(null),
		};
	}, [authData]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth phai duoc su dung trong AuthProvider');
	}

	return context;
}
