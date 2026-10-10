const Auth = (() => {
    const TOKEN_KEY = 'token';

    const getToken = () => sessionStorage.getItem(TOKEN_KEY);
    const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
    const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

    const decode = (token) => {
        try {
            const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(payload));
        } catch {
            return null;
        }
    };

    const getPayload = () => {
        const token = getToken();
        return token ? decode(token) : null;
    };

    const isExpired = (payload) => !payload || !payload.exp || payload.exp * 1000 <= Date.now();

    const getRoles = () => {
        const payload = getPayload();
        return payload ? payload.roles || [] : [];
    };

    const isAdmin = () => getRoles().includes('admin');

    const homePath = () => (isAdmin() ? '/admin' : '/dashboard');

    const logout = () => {
        clearToken();
        window.location.href = '/signIn';
    };

    const requireAuth = (roles = []) => {
        const payload = getPayload();

        if (isExpired(payload)) {
            logout();
            return false;
        }

        if (roles.length && !payload.roles.some(r => roles.includes(r))) {
            window.location.href = '/403';
            return false;
        }

        setTimeout(logout, payload.exp * 1000 - Date.now());
        return true;
    };

    const redirectIfLogged = () => {
        const payload = getPayload();
        if (payload && !isExpired(payload)) window.location.href = homePath();
    };

    const api = async (path, options = {}) => {
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(path, { ...options, headers });

        let data = null;
        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (response.status === 401 && token) {
            logout();
            throw new Error('Sesión expirada');
        }

        if (response.status === 403) {
            window.location.href = '/403';
            throw new Error('Acceso denegado');
        }

        if (!response.ok) {
            throw new Error((data && data.message) || 'Error en la solicitud');
        }

        return data;
    };

    const notify = (message, ok = false) => {
        M.toast({ html: message, classes: ok ? 'green darken-1' : 'red darken-1' });
    };

    const formatDate = (value) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('es-PE', { timeZone: 'UTC' });
    };

    return {
        getToken,
        getPayload,
        setToken,
        getRoles,
        isAdmin,
        homePath,
        logout,
        requireAuth,
        redirectIfLogged,
        api,
        notify,
        formatDate
    };
})();