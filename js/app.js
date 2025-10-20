import * as api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // NOTA: La verificación diaria de mensualidades se ha movido al backend (servidor)
    // para garantizar su ejecución fiable a través de un Cron Job.
    // El código de 'setInterval' ha sido eliminado de este archivo.

    const mainContent = document.getElementById('main-content');

    // Objeto 'views' con todas las vistas HTML
    const views = {
        dashboard: `
            <header class="flex justify-between items-center pb-6 border-b">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Dashboard Principal</h1>
                    <p id="current-date" class="text-gray-500">Cargando fecha...</p>
                </div>
                <button id="refresh-data" class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5"></path></svg>
                    Actualizar Datos
                </button>
            </header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-blue-100 p-3 rounded-full"><svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V8.618a1 1 0 01.553-.894L9 5l6 2.724a1 1 0 01.447.894v7.764a1 1 0 01-.553.894L9 20z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Vehículos Dentro</p><p id="vehicles-inside" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-green-100 p-3 rounded-full"><svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Ingresos del Día</p><p id="daily-revenue" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-yellow-100 p-3 rounded-full"><svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Mensualidades Activas</p><p id="active-memberships" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-orange-100 p-3 rounded-full"><svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Próximas a Vencer</p><p id="expiring-memberships" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-red-100 p-3 rounded-full"><svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Mensualidades Vencidas</p><p id="expired-memberships" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                <div class="lg:col-span-3 bg-white p-6 rounded-xl shadow"><h3 class="text-lg font-semibold text-gray-800 mb-4">Ingresos de la Semana</h3><div class="chart-container"><canvas id="weeklyRevenueChart"></canvas></div></div>
                <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow"><h3 class="text-lg font-semibold text-gray-800 mb-4">Ocupación Actual</h3><div class="chart-container"><canvas id="occupancyTypeChart"></canvas></div></div>
            </div>
        `,
        operators: `
            <header class="flex justify-between items-center pb-6 border-b">
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Operadores</h1>
                <button id="btn-new-operator" class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Nuevo Operador
                </button>
            </header>
            <div class="mt-6 bg-white p-6 rounded-xl shadow">
                <div class="overflow-x-auto">
                    <table id="operators-table" class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="p-4 text-sm font-semibold text-gray-600">Nombre</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Email</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Estado</th>
                                <th class="p-4 text-sm font-semibold text-gray-600 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="animate-pulse">
                                <td colspan="4" class="text-center py-4 text-gray-500">Cargando operadores...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        memberships: `
            <header class="flex justify-between items-center pb-6 border-b">
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Mensualidades</h1>
                <button id="btn-new-membership" class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Nueva Mensualidad
                </button>
            </header>
            <div class="mt-6 bg-white p-6 rounded-xl shadow">
                <div class="overflow-x-auto">
                    <table id="memberships-table" class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="p-4 text-sm font-semibold text-gray-600">Cliente</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Placa</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Inicio</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Fin</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Estado</th>
                                <th class="p-4 text-sm font-semibold text-gray-600 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="animate-pulse">
                                <td colspan="6" class="text-center py-4 text-gray-500">Cargando mensualidades...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        tariffs: `
            <header class="pb-6 border-b">
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Tarifas (Activa)</h1>
            </header>
            <div class="mt-6 bg-white p-8 rounded-xl shadow max-w-2xl mx-auto">
                <form id="tariff-form" class="space-y-6">
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                        <input type="text" name="description" id="description" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Ej: Tarifa General 2025">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="base-rate" class="block text-sm font-medium text-gray-700">Valor base por hora</label>
                            <input type="number" step="0.01" name="base-rate" id="base-rate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        </div>
                        <div>
                            <label for="fraction-rate" class="block text-sm font-medium text-gray-700">Valor adicional por fracción</label>
                            <input type="number" step="0.01" name="fraction-rate" id="fraction-rate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="daily-cap" class="block text-sm font-medium text-gray-700">Tope Diario</label>
                            <input type="number" step="0.01" name="daily-cap" id="daily-cap" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        </div>
                        <div>
                            <label for="grace-period" class="block text-sm font-medium text-gray-700">Tiempo de Gracia (min)</label>
                            <input type="number" name="grace-period" id="grace-period" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        </div>
                    </div>
                    <div class="pt-4 text-right">
                        <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `,
        reports: `
            <header class="flex justify-between items-center pb-6 border-b">
                <h1 class="text-3xl font-bold text-gray-800">Reportes y Análisis</h1>
                <div class="flex space-x-2">
                    <button id="export-csv" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">Exportar CSV</button>
                    <button id="export-excel" class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">Exportar Excel</button>
                </div>
            </header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="bg-white p-6 rounded-xl shadow">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Ingresos (Pagos) Recientes</h3>
                    <div class="overflow-x-auto">
                        <table id="report-ingresos-table" class="w-full text-left">
                            <thead>
                                <tr class="border-b bg-gray-50">
                                    <th class="p-4 text-sm font-semibold text-gray-600">Fecha</th>
                                    <th class="p-4 text-sm font-semibold text-gray-600">Total</th>
                                </tr>
                            </thead>
                            <tbody><tr><td colspan="2" class="text-center p-4 text-gray-500">Cargando...</td></tr></tbody>
                        </table>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Ocupación por Tipo de Vehículo</h3>
                    <div class="overflow-x-auto">
                        <table id="report-ocupacion-table" class="w-full text-left">
                            <thead>
                                <tr class="border-b bg-gray-50">
                                    <th class="p-4 text-sm font-semibold text-gray-600">Tipo Vehículo</th>
                                    <th class="p-4 text-sm font-semibold text-gray-600">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody><tr><td colspan="2" class="text-center p-4 text-gray-500">Cargando...</td></tr></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,

    };

    // --- LÓGICA DEL DASHBOARD ---
    const initializeDashboard = async () => {
        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        const loadDashboardData = async () => {
            try {
                const data = await api.getDashboardData();
                
                document.getElementById('vehicles-inside').textContent = data.vehiculosDentro ?? '0';
                document.getElementById('daily-revenue').textContent = (data.ingresosDia ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
                document.getElementById('active-memberships').textContent = data.mensualidadesActivas ?? '0';
                document.getElementById('expiring-memberships').textContent = data.mensualidadesProximas ?? '0';
                document.getElementById('expired-memberships').textContent = data.mensualidadesVencidas ?? '0';

                // Limpiar gráficos anteriores si existen
                if (window.weeklyChart) window.weeklyChart.destroy();
                if (window.occupancyChart) window.occupancyChart.destroy();
              
                const weeklyCtx = document.getElementById('weeklyRevenueChart')?.getContext('2d');
                if (weeklyCtx && data.ingresosSemana && window.Chart) {
                    window.weeklyChart = new Chart(weeklyCtx, {
                        type: 'line',
                        data: {
                            labels: data.ingresosSemana.map(item => new Date(item.fecha).toLocaleDateString('es-CO', { weekday: 'short' })),
                            datasets: [{
                                label: 'Ingresos',
                                data: data.ingresosSemana.map(item => item.total),
                                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                borderColor: 'rgba(79, 70, 229, 1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.3
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    });
                }
                
                const occupancyCtx = document.getElementById('occupancyTypeChart')?.getContext('2d');
                if (occupancyCtx && data.ocupacion && window.Chart) {
                       window.occupancyChart = new Chart(occupancyCtx, {
                        type: 'doughnut',
                        data: {
                            labels: data.ocupacion.map(item => item.tipo_vehiculo),
                            datasets: [{
                                data: data.ocupacion.map(item => item.cantidad),
                                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                            }]
                        },
                         options: { responsive: true, maintainAspectRatio: false }
                    });
                }

            } catch (err) {
                console.error('Error cargando datos del dashboard:', err);
                document.querySelectorAll('.metric-card p.text-2xl').forEach(el => el.textContent = 'Error');
            }
        };
        
        await loadDashboardData();
        document.getElementById('refresh-data')?.addEventListener('click', loadDashboardData);
    };


    // --- MANEJADORES DE MODALES ---
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.querySelector('.modal-content')?.classList.remove('scale-95'), 10);
        }
    };
    
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.querySelector('.modal-content')?.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                if (modalId === 'modal-operator') window.editingOperatorId = null;
                if (modalId === 'modal-membership') window.editingMembershipId = null;
            }
        }, 300);
    };

    const initializeModalHandlers = () => {
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('[id^="modal-"]');
                if (modal) closeModal(modal.id);
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal.id);
            });
        });
    };
    
    // --- LÓGICA DE OPERADORES ---
    async function handleOperatorsView() {
        const tbody = document.querySelector('#operators-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">Cargando operadores...</td></tr>';
        
        try {
            const operators = await api.getOperators();
            tbody.innerHTML = ''; 

            if (!operators || operators.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">No hay operadores.</td></tr>';
                return;
            }

            operators.forEach(op => {
                const tr = document.createElement('tr');
                tr.className = 'border-b hover:bg-gray-50';

                const statusToggleHTML = `
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer status-toggle" data-id="${op.id_operador}" ${op.activo ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span class="ml-3 text-sm font-medium text-gray-900">${op.activo ? 'Activo' : 'Inactivo'}</span>
                    </label>
                `;

                tr.innerHTML = `
                    <td class="p-4">${op.nombre || ''}</td>
                    <td class="p-4">${op.correo || ''}</td>
                    <td class="p-4">${statusToggleHTML}</td>
                    <td class="p-4 text-right">
                        <button class="edit-operator mr-2 px-3 py-1 bg-yellow-400 text-yellow-900 font-semibold rounded hover:bg-yellow-500 transition" data-id="${op.id_operador}">Editar</button>
                        <button class="delete-operator px-3 py-1 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition" data-id="${op.id_operador}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.status-toggle').forEach(toggle => {
                toggle.addEventListener('change', async (e) => {
                    const id = e.target.dataset.id;
                    const newStatus = e.target.checked;
                    const span = e.target.nextElementSibling.nextElementSibling;
                    span.textContent = newStatus ? 'Activo' : 'Inactivo';

                    try {
                        const operator = await api.getOperator(id);
                        const updatedData = { ...operator, id_operador: parseInt(id), activo: newStatus };
                        await api.updateOperator(id, updatedData);
                    } catch (err) {
                        console.error('Error al cambiar estado:', err);
                        e.target.checked = !newStatus; 
                        span.textContent = !newStatus ? 'Activo' : 'Inactivo';
                        alert('No se pudo cambiar el estado del operador.');
                    }
                });
            });

            tbody.querySelectorAll('.edit-operator').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    try {
                        const data = await api.getOperator(id);
                        const form = document.getElementById('operator-form');
                        
                        document.getElementById('operator-modal-title').textContent = 'Editar Operador';
                        document.getElementById('operator-submit-button').textContent = 'Guardar Cambios';

                        form.querySelector('#name').value = data.nombre || '';
                        form.querySelector('#email').value = data.correo || '';
                        
                        const statusContainer = form.querySelector('#activo').parentElement.parentElement;
                        if(statusContainer) statusContainer.style.display = 'none';

                        window.editingOperatorId = id;
                        openModal('modal-operator');
                    } catch (err) {
                        console.error('Error obteniendo operador:', err);
                        alert('No se pudo cargar el operador para editar.');
                    }
                });
            });

            tbody.querySelectorAll('.delete-operator').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    if (!confirm('¿Estás seguro de que quieres INACTIVAR este operador? El operador ya no podrá iniciar sesión.')) return;
                    try {
                        const operator = await api.getOperator(id);
                        const updatedData = { ...operator, id_operador: parseInt(id), activo: false };
                        await api.updateOperator(id, updatedData);
                        await handleOperatorsView();
                    } catch (err) {
                        console.error('Error al inactivar operador:', err);
                        alert('No se pudo inactivar el operador.');
                    }
                });
            });

        } catch (err) {
            console.error('Error cargando operadores:', err);
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500">Error al cargar operadores</td></tr>';
        }
    }

    // --- LÓGICA DE MENSUALIDADES ---
    async function handleMembershipsView() {
        const tbody = document.querySelector('#memberships-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">Cargando mensualidades...</td></tr>';

        try {
            const memberships = await api.getMemberships();
            tbody.innerHTML = '';

            if (!memberships || memberships.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">No hay mensualidades registradas.</td></tr>';
                return;
            }

            memberships.forEach(mem => {
                const tr = document.createElement('tr');
                tr.className = 'border-b hover:bg-gray-50';

                const startDate = new Date(mem.fecha_inicio).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
                const endDate = new Date(mem.fecha_fin).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
                
                const statusToggleHTML = `
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer membership-status-toggle" data-id="${mem.id_mensualidad}" ${mem.activa ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span class="ml-3 text-sm font-medium text-gray-900">${mem.activa ? 'Activa' : 'Inactiva'}</span>
                    </label>
                `;

                tr.innerHTML = `
                    <td class="p-4">
                        <div class="font-medium text-gray-900">${mem.nombre_cliente}</div>
                        <div class="text-sm text-gray-500">${mem.correo}</div>
                    </td>
                    <td class="p-4 font-mono text-gray-800">${mem.placa}</td>
                    <td class="p-4">${startDate}</td>
                    <td class="p-4">${endDate}</td>
                    <td class="p-4">${statusToggleHTML}</td>
                    <td class="p-4 text-right">
                        <button class="edit-membership mr-2 px-3 py-1 bg-yellow-400 text-yellow-900 font-semibold rounded hover:bg-yellow-500 transition" data-id="${mem.id_mensualidad}">Editar</button>
                        <button class="delete-membership px-3 py-1 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition" data-id="${mem.id_mensualidad}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.membership-status-toggle').forEach(toggle => {
                toggle.addEventListener('change', async (e) => {
                    const id = e.target.dataset.id;
                    const newStatus = e.target.checked;
                    const span = e.target.nextElementSibling.nextElementSibling;
                    span.textContent = newStatus ? 'Activa' : 'Inactiva';

                    try {
                        const membership = await api.getMembership(id);
                        const updatedData = {
                            ...membership,
                            id_mensualidad: parseInt(id),
                            activa: newStatus
                        };
                        await api.updateMembership(id, updatedData);
                    } catch (err) {
                        console.error('Error al cambiar estado de la mensualidad:', err);
                        e.target.checked = !newStatus;
                         span.textContent = !newStatus ? 'Activa' : 'Inactiva';
                        alert('No se pudo cambiar el estado de la mensualidad.');
                    }
                });
            });

            tbody.querySelectorAll('.edit-membership').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    try {
                        const data = await api.getMembership(id);
                        const form = document.getElementById('membership-form');

                        document.getElementById('membership-modal-title').textContent = 'Editar Mensualidad';
                        document.getElementById('membership-submit-button').textContent = 'Guardar Cambios';

                        form.querySelector('#clientName').value = data.nombre_cliente || '';
                        form.querySelector('#clientEmail').value = data.correo || '';
                        form.querySelector('#vehiclePlate').value = data.placa || '';
                        form.querySelector('#startDate').value = data.fecha_inicio.split('T')[0];
                        form.querySelector('#endDate').value = data.fecha_fin.split('T')[0];
                        
                        const statusContainer = form.querySelector('#membership-activo').parentElement.parentElement;
                        if(statusContainer) statusContainer.style.display = 'none';

                        window.editingMembershipId = id;
                        openModal('modal-membership');
                    } catch (err) {
                        console.error('Error obteniendo mensualidad:', err);
                        alert('No se pudo cargar la mensualidad para editar.');
                    }
                });
            });

            tbody.querySelectorAll('.delete-membership').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    if (!confirm('¿Estás seguro de que quieres INACTIVAR esta mensualidad?')) return;
                    try {
                        const membership = await api.getMembership(id);
                        const updatedData = { ...membership, id_mensualidad: parseInt(id), activa: false };
                        await api.updateMembership(id, updatedData);
                        await handleMembershipsView();
                    } catch (err) {
                        console.error('Error al inactivar mensualidad:', err);
                        alert('No se pudo inactivar la mensualidad.');
                    }
                });
            });

        } catch (err) {
            console.error('Error cargando mensualidades:', err);
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-red-500">Error al cargar las mensualidades.</td></tr>';
        }
    }

    // --- LÓGICA DE TARIFAS ---
    async function handleTariffsView() {
        const form = document.getElementById('tariff-form');
        if (!form) return;
        
        let activeTariffId = null;

        try {
            const tariff = await api.getActiveTariff(); 
            if (tariff) {
                form.querySelector('#description').value = tariff.descripcion ?? '';
                form.querySelector('#base-rate').value = tariff.valor_base_hora ?? 0;
                form.querySelector('#fraction-rate').value = tariff.valor_fraccion ?? 0;
                form.querySelector('#daily-cap').value = tariff.tope_diario ?? 0;
                form.querySelector('#grace-period').value = tariff.tiempo_gracia_min ?? 0;
                activeTariffId = tariff.id_tarifa;
            } else {
                alert('No se encontró una tarifa activa. Por favor, configure una.');
            }
        } catch (err) {
            console.error('Error cargando tarifa activa:', err);
            alert('No se pudo cargar la tarifa actual.');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!activeTariffId) {
                alert('Error: No hay una tarifa activa para actualizar.');
                return;
            }
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Guardando...';

            try {
                const currentTariff = await api.getTariff(activeTariffId);

                const data = {
                    ...currentTariff,
                    id_tarifa: activeTariffId, 
                    descripcion: form.querySelector('#description').value,
                    valor_base_hora: parseFloat(form.querySelector('#base-rate').value),
                    valor_fraccion: parseFloat(form.querySelector('#fraction-rate').value),
                    tope_diario: parseFloat(form.querySelector('#daily-cap').value),
                    tiempo_gracia_min: parseInt(form.querySelector('#grace-period').value)
                };

                await api.updateTariff(activeTariffId, data);
                alert('Tarifa actualizada con éxito.');
            } catch (err) {
                console.error('Error actualizando tarifa:', err);
                alert(`Error al guardar la tarifa: ${err.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // --- LÓGICA DE REPORTES ---
    async function handleReportsView() {
        const ingresosTbody = document.querySelector('#report-ingresos-table tbody');
        if (ingresosTbody) {
            try {
                const ingresosData = await api.getTicketsIngresos(); 
                ingresosTbody.innerHTML = '';
                if (ingresosData && ingresosData.length > 0) {
                    ingresosData.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.className = 'border-b hover:bg-gray-50';
                        tr.innerHTML = `
                            <td class="p-4">${new Date(item.fecha).toLocaleDateString('es-CO')}</td>
                            <td class="p-4">${(item.total ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                        `;
                        ingresosTbody.appendChild(tr);
                    });
                } else {
                    ingresosTbody.innerHTML = '<tr><td colspan="2" class="text-center p-4">No hay datos de ingresos.</td></tr>';
                }
            } catch (err) {
                console.error('Error cargando reporte de ingresos:', err);
                ingresosTbody.innerHTML = '<tr><td colspan="2" class="text-center p-4 text-red-500">Error al cargar ingresos.</td></tr>';
            }
        }

        const ocupacionTbody = document.querySelector('#report-ocupacion-table tbody');
        if (ocupacionTbody) {
            try {
                const ocupacionData = await api.getTicketsOcupacion(); 
                ocupacionTbody.innerHTML = '';
                if (ocupacionData && ocupacionData.length > 0) {
                    ocupacionData.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.className = 'border-b hover:bg-gray-50';
                        tr.innerHTML = `
                            <td class="p-4">${item.tipo_vehiculo}</td>
                            <td class="p-4">${item.cantidad}</td>
                        `;
                        ocupacionTbody.appendChild(tr);
                    });
                } else {
                    ocupacionTbody.innerHTML = '<tr><td colspan="2" class="text-center p-4">No hay datos de ocupación.</td></tr>';
                }
            } catch (err) {
                console.error('Error cargando reporte de ocupación:', err);
                ocupacionTbody.innerHTML = '<tr><td colspan="2" class="text-center p-4 text-red-500">Error al cargar ocupación.</td></tr>';
            }
        }

        document.getElementById('export-csv')?.addEventListener('click', api.exportCsv);
        document.getElementById('export-excel')?.addEventListener('click', api.exportExcel);
    }

    // --- MANEJADOR DE VISTAS (Router principal) ---
    const renderView = (viewName) => {
        mainContent.innerHTML = views[viewName] || `<p>Vista no encontrada.</p>`;

        const viewHandlers = {
            dashboard: initializeDashboard,
            operators: handleOperatorsView,
            memberships: handleMembershipsView,
            tariffs: handleTariffsView,
            reports: handleReportsView,
        };
        viewHandlers[viewName]?.();

        document.getElementById('btn-new-operator')?.addEventListener('click', () => {
            window.editingOperatorId = null;
            const form = document.getElementById('operator-form');
            form?.reset();
            document.getElementById('operator-modal-title').textContent = 'Nuevo Operador';
            document.getElementById('operator-submit-button').textContent = 'Crear Operador';
            
            const statusContainer = form.querySelector('#activo').parentElement.parentElement;
            if(statusContainer) statusContainer.style.display = 'block';

            const statusCheckbox = form.querySelector('#activo');
            if (statusCheckbox) statusCheckbox.checked = true;
            openModal('modal-operator');
        });
        
        document.getElementById('btn-new-membership')?.addEventListener('click', () => {
            window.editingMembershipId = null;
            const form = document.getElementById('membership-form');
            form?.reset();
            document.getElementById('membership-modal-title').textContent = 'Nueva Mensualidad';
            document.getElementById('membership-submit-button').textContent = 'Crear Mensualidad';
            
            const statusContainer = form.querySelector('#membership-activo').parentElement.parentElement;
            if(statusContainer) statusContainer.style.display = 'block';

            const statusCheckbox = form.querySelector('#membership-activo');
            if (statusCheckbox) statusCheckbox.checked = true;
            
            openModal('modal-membership');
        });

        document.querySelectorAll('#main-nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.view === viewName)
        });
    };

    // --- INICIALIZACIÓN Y MANEJADORES DE FORMULARIOS GLOBALES ---
    initializeModalHandlers(); 

    // Manejador del formulario de operador (Crear/Editar)
    const operatorForm = document.getElementById('operator-form');
    if (operatorForm) {
        operatorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = document.getElementById('operator-submit-button');
            submitButton.disabled = true;
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Guardando...';
            
            try {
                if (window.editingOperatorId) {
                    const originalOperator = await api.getOperator(window.editingOperatorId);
                    const operatorData = {
                        ...originalOperator,
                        id_operador: parseInt(window.editingOperatorId),
                        nombre: operatorForm.querySelector('#name').value,
                        correo: operatorForm.querySelector('#email').value,
                        activo: originalOperator.activo, 
                    };
                    await api.updateOperator(window.editingOperatorId, operatorData);
                } else {
                    const operatorData = {
                        nombre: operatorForm.querySelector('#name').value,
                        correo: operatorForm.querySelector('#email').value,
                        activo: operatorForm.querySelector('#activo').checked
                    };
                    await api.createOperator(operatorData);
                }
                closeModal('modal-operator');
                await handleOperatorsView(); 
            } catch (error) {
                console.error('Error al guardar operador:', error);
                alert(`Error al guardar: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
    
    // Manejador del formulario de mensualidad (Crear/Editar)
    const membershipForm = document.getElementById('membership-form');
    if (membershipForm) {
        membershipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = document.getElementById('membership-submit-button');
            submitButton.disabled = true;
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Guardando...';

            try {
                if (window.editingMembershipId) {
                    const originalMembership = await api.getMembership(window.editingMembershipId);
                    const membershipData = {
                        ...originalMembership, 
                        id_mensualidad: parseInt(window.editingMembershipId),
                        nombre_cliente: membershipForm.querySelector('#clientName').value,
                        correo: membershipForm.querySelector('#clientEmail').value,
                        placa: membershipForm.querySelector('#vehiclePlate').value.toUpperCase(),
                        fecha_inicio: membershipForm.querySelector('#startDate').value,
                        fecha_fin: membershipForm.querySelector('#endDate').value,
                        activa: originalMembership.activa
                    };
                    await api.updateMembership(window.editingMembershipId, membershipData);
                } else {
                     const membershipData = {
                        nombre_cliente: membershipForm.querySelector('#clientName').value,
                        correo: membershipForm.querySelector('#clientEmail').value,
                        placa: membershipForm.querySelector('#vehiclePlate').value.toUpperCase(),
                        fecha_inicio: membershipForm.querySelector('#startDate').value,
                        fecha_fin: membershipForm.querySelector('#endDate').value,
                        activa: membershipForm.querySelector('#membership-activo').checked
                    };
                    const nuevaMensualidad = await api.createMembership(membershipData);
                    if (nuevaMensualidad && nuevaMensualidad.id_mensualidad) {
                        await api.sendMembershipCreationEmail(nuevaMensualidad.id_mensualidad);
                    }
                }
                closeModal('modal-membership');
                await handleMembershipsView();
            } catch (error) {
                console.error('Error al guardar mensualidad:', error);
                alert(`Error al guardar la mensualidad: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // --- NAVEGACIÓN Y CARGA INICIAL ---
    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            renderView(link.dataset.view);
        });
    });

    // Carga inicial
    renderView('dashboard');
});

