const BASE = 'http://10.0.11.2:5127/api';

async function request(path, options = {}) {
    const url = `${BASE}${path}`;
    try {
        const res = await fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options));
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
        }
        if (res.status === 204) return null;
        const data = await res.json().catch(() => null);
        return data;
    } catch (err) {
        console.error('API request error', { url, options, err });
        throw err;
    }
}

export async function getOperators() {
    return request('/Operadores');
}

export async function getOperator(id) {
    return request(`/Operadores/${id}`);
}

export async function createOperator(operator) {
    return request('/Operadores', { method: 'POST', body: JSON.stringify(operator) });
}

export async function updateOperator(id, operator) {
    return request(`/Operadores/${id}`, { method: 'PUT', body: JSON.stringify(operator) });
}

export async function deleteOperator(id) {
    return request(`/Operadores/${id}`, { method: 'DELETE' });
}
