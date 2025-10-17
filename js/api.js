const BASE = 'http://10.0.11.2:5127/api';

async function request(path, options = {}) {
    const url = `${BASE}${path}`;
    try {
        console.log('API Request:', { url, method: options.method, body: options.body });
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            }
        });
        
        const text = await res.text();
        console.log('API Response:', { status: res.status, text });
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
        }
        
        if (res.status === 204) return null;
        
        try {
            return text ? JSON.parse(text) : null;
        } catch (e) {
            console.warn('Response no es JSON válido:', text);
            return null;
        }
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
