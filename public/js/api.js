const BASE_URL = 'https://crudpark-backend.onrender.com/api';

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = errorText;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
            } catch (e) {
            }
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        
        return await response.text();

    } catch (error) {
        console.error(`Error en la petición API [${options.method || 'GET'} ${endpoint}]:`, error.message);
        throw error; 
    }
}

// --- API de Operadores ---

export const getOperators = () => request('/Operadores');
export const getOperator = (id) => request(`/Operadores/${id}`);
export const createOperator = (data) => request('/Operadores', { method: 'POST', body: data });
export const updateOperator = (id, data) => request(`/Operadores/${id}`, { method: 'PUT', body: data });
export const deleteOperator = (id) => request(`/Operadores/${id}`, { method: 'DELETE' });

// --- API de Mensualidades ---

export const getMemberships = () => request('/Mensualidades');
export const getMembership = (id) => request(`/Mensualidades/${id}`);
export const createMembership = (data) => request('/Mensualidades', { method: 'POST', body: data });
export const updateMembership = (id, data) => request(`/Mensualidades/${id}`, { method: 'PUT', body: data });
export const deleteMembership = (id) => request(`/Mensualidades/${id}`, { method: 'DELETE' });

// --- API de Notificaciones y Tareas ---

export const checkExpiringMembershipsApi = () => request('/Notificaciones/enviar-vencimientos', { method: 'POST' });
export const sendMembershipCreationEmail = (idMensualidad) => request(`/Notificaciones/enviar-creacion/${idMensualidad}`, { method: 'POST' });

// --- API de Dashboard ---

export const getDashboardData = () => request('/Dashboard');

// --- API de Tarifas ---

export const getTariffs = () => request('/Tarifas');
export const getActiveTariff = () => request('/Tarifas/activa');
export const getTariff = (id) => request(`/Tarifas/${id}`);
export const updateTariff = (id, data) => request(`/Tarifas/${id}`, { method: 'PUT', body: data });

// --- API de Tickets ---

export const getTickets = () => request('/Tickets');
export const deleteTicket = (id) => request(`/Tickets/${id}`, { method: 'DELETE' });

// --- API de Pagos ---
export const getPayments = () => request('/Pagos');
export const deletePago = (id) => request(`/Pagos/${id}`, { method: 'DELETE' });


// --- API de Reportes de Tickets ---

export const getTicketsIngresos = () => request('/Tickets/ingresos');
export const getTicketsOcupacion = () => request('/Tickets/ocupacion');
export const getTicketsComparativa = () => request('/Tickets/comparativa');
export const exportTicketsCSV = () => request('/Tickets/export/csv');
export const exportTicketsExcel = () => request('/Tickets/export/excel');

