// Define la URL base de tu API de backend
const BASE_URL = 'http://localhost:5127/api';

/**
 * Función auxiliar para realizar todas las peticiones a la API.
 * Maneja la configuración, el envío de JSON y la gestión de errores.
 */
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Si hay un cuerpo (body), lo convertimos a JSON
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);

        // Si la respuesta no es OK (ej: 404, 500)
        if (!response.ok) {
            // Leemos el cuerpo de la respuesta UNA SOLA VEZ como texto.
            const errorText = await response.text();
            let errorMessage = errorText;
            try {
                // Intentamos interpretar el texto como JSON para obtener un mensaje más claro.
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
            } catch (e) {
                // Si no es JSON, usamos el texto del error tal cual.
            }
            throw new Error(errorMessage);
        }

        // Si la respuesta es 204 (No Content), no hay cuerpo que parsear
        if (response.status === 204) {
            return null;
        }

        // Intenta parsear la respuesta como JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        
        // Devuelve como texto si no es JSON
        return await response.text();

    } catch (error) {
        console.error(`Error en la petición API [${options.method || 'GET'} ${endpoint}]:`, error.message);
        throw error; // Propaga el error para que el frontend pueda manejarlo
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

// NOTA: Estas funciones se asumen basadas en la necesidad del frontend.
// Asegúrate de que tu backend tenga estos endpoints.
export const getTickets = () => request('/Tickets');
export const deleteTicket = (id) => request(`/Tickets/${id}`, { method: 'DELETE' });

// --- API de Pagos ---
// NOTA: Estas funciones se asumen basadas en la necesidad del frontend.
export const getPayments = () => request('/Pagos');
export const deletePago = (id) => request(`/Pagos/${id}`, { method: 'DELETE' });


// --- API de Reportes de Tickets ---

export const getTicketsIngresos = () => request('/Tickets/ingresos');
export const getTicketsOcupacion = () => request('/Tickets/ocupacion');
export const getTicketsComparativa = () => request('/Tickets/comparativa');
export const exportTicketsCSV = () => request('/Tickets/export/csv');
export const exportTicketsExcel = () => request('/Tickets/export/excel');

