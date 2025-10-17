import { checkExpiringMemberships } from './membershipNotifications.js';

document.addEventListener('DOMContentLoaded', () => {
    // Configurar verificación diaria de mensualidades por vencer
    const checkMemberships = async () => {
        try {
            const notificationsSent = await checkExpiringMemberships();
            if (notificationsSent > 0) {
                console.log(`Se enviaron ${notificationsSent} notificaciones de vencimiento`);
            }
        } catch (error) {
            console.error('Error al verificar mensualidades:', error);
        }
    };

    // Ejecutar la verificación inmediatamente al cargar
    checkMemberships();

    // Programar la verificación diaria (86400000 ms = 24 horas)
    setInterval(checkMemberships, 86400000);

    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('#main-nav a');

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
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-blue-100 p-3 rounded-full"><svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V8.618a1 1 0 01.553-.894L9 5l6 2.724a1 1 0 01.447.894v7.764a1 1 0 01-.553.894L9 20z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Vehículos Dentro</p><p id="vehicles-inside" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-green-100 p-3 rounded-full"><svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Ingresos del Día</p><p id="daily-revenue" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-yellow-100 p-3 rounded-full"><svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Mensualidades Activas</p><p id="active-memberships" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-orange-100 p-3 rounded-full"><svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Próximas a Vencer</p><p id="expiring-memberships" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
                <div class="metric-card bg-white p-6 rounded-xl shadow"><div class="flex items-center"><div class="bg-red-100 p-3 rounded-full"><svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></div><div class="ml-4"><p class="text-sm text-gray-500">Mensualidades Vencidas</p><p id="expired-memberships" class="text-2xl font-bold text-gray-800">...</p></div></div></div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                <div class="lg:col-span-3 bg-white p-6 rounded-xl shadow"><h3 class="text-lg font-semibold text-gray-800 mb-4">Ingresos de la Semana</h3><div class="chart-container"><canvas id="weeklyRevenueChart"></canvas></div></div>
                <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow"><h3 class="text-lg font-semibold text-gray-800 mb-4">Ocupación Actual</h3><div class="chart-container"><canvas id="occupancyTypeChart"></canvas></div></div>
            </div>
        `,
        operators: `
            <header class="flex justify-between items-center pb-6 border-b">
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Operadores</h1>
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center">
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
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center">
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
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Tarifas</h1>
            </header>
            <div class="mt-6 bg-white p-8 rounded-xl shadow max-w-2xl mx-auto">
                <form class="space-y-6">
                    <div>
                        <label for="base-rate" class="block text-sm font-medium text-gray-700">Valor base por hora</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" name="base-rate" id="base-rate" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="3000" value="3000">
                        </div>
                    </div>
                    <div>
                        <label for="fraction-rate" class="block text-sm font-medium text-gray-700">Valor adicional por fracción</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" name="fraction-rate" id="fraction-rate" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="1500" value="1500">
                        </div>
                    </div>
                    <div>
                        <label for="daily-cap" class="block text-sm font-medium text-gray-700">Tope diario</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" name="daily-cap" id="daily-cap" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="20000" value="20000">
                        </div>
                    </div>
                    <div>
                        <label for="grace-period" class="block text-sm font-medium text-gray-700">Tiempo de gracia (minutos)</label>
                        <input type="number" name="grace-period" id="grace-period" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="30" value="30">
                        <p class="mt-2 text-xs text-gray-500">Mínimo 30 minutos, según reglas de negocio.</p>
                    </div>
                    <div class="pt-4 text-right">
                        <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `,
        reports: `
            <header class="flex justify-between items-center pb-6 border-b">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Reportes y Análisis</h1>
                    <p class="text-sm text-gray-500 mt-1">Análisis detallado de la operación del parqueadero</p>
                </div>
                <div class="flex gap-3">
                    <button id="export-monthly" class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Exportar Mensual
                    </button>
                    <button id="export-daily" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Exportar Diario
                    </button>
                </div>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <!-- Ingresos Mensuales -->
                <div class="bg-white p-6 rounded-xl shadow">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Ingresos Mensuales</h3>
                    <div class="chart-container">
                        <canvas id="monthlyRevenueChart"></canvas>
                    </div>
                </div>

                <!-- Ocupación por Tipo -->
                <div class="bg-white p-6 rounded-xl shadow">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribución de Ocupación</h3>
                    <div class="chart-container">
                        <canvas id="occupancyDistributionChart"></canvas>
                    </div>
                </div>

                <!-- Horas Pico -->
                <div class="bg-white p-6 rounded-xl shadow">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Horas Pico de Ocupación</h3>
                    <div class="chart-container">
                        <canvas id="peakHoursChart"></canvas>
                    </div>
                </div>

                <!-- Tendencia de Mensualidades -->
                <div class="bg-white p-6 rounded-xl shadow">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Tendencia de Mensualidades</h3>
                    <div class="chart-container">
                        <canvas id="membershipTrendChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Tabla de Resumen -->
            <div class="mt-6 bg-white p-6 rounded-xl shadow">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen de Operaciones</h3>
                <div class="overflow-x-auto">
                    <table id="operations-summary" class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="p-4 text-sm font-semibold text-gray-600">Fecha</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Total Ingresos</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Vehículos</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Tiempo Promedio</th>
                                <th class="p-4 text-sm font-semibold text-gray-600">Ocupación Máx</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="animate-pulse">
                                <td colspan="5" class="text-center py-4 text-gray-500">Cargando datos...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    };

    // --- LÓGICA DEL DASHBOARD ---
    const initializeDashboard = () => {
        const setCurrentDate = () => {
            const dateElement = document.getElementById('current-date');
            if(!dateElement) return;
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('es-CO', options);
        };

        const fetchDashboardData = async () => {
            console.log("Obteniendo datos del back-end...");
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockData = {
                vehiclesInside: 73, dailyRevenue: 1250000.50, activeMemberships: 112,
                expiringSoonMemberships: 15, expiredMemberships: 8,
                weeklyRevenue: { labels: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], amounts: [980000, 1150000, 1320000, 1250000, 1800000, 2100000, 1600000] },
                occupancy: { members: 58, guests: 15 }
            };
            return mockData;
        };

        const updateMetricCards = (data) => {
            document.getElementById('vehicles-inside').textContent = data.vehiclesInside;
            document.getElementById('daily-revenue').textContent = data.dailyRevenue.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
            document.getElementById('active-memberships').textContent = data.activeMemberships;
            document.getElementById('expiring-memberships').textContent = data.expiringSoonMemberships;
            document.getElementById('expired-memberships').textContent = data.expiredMemberships;
        };

        const createCharts = (data) => {
            Chart.getChart('weeklyRevenueChart')?.destroy();
            Chart.getChart('occupancyTypeChart')?.destroy();

            const weeklyCtx = document.getElementById('weeklyRevenueChart')?.getContext('2d');
            if (weeklyCtx) new Chart(weeklyCtx, { type: 'bar', data: { labels: data.weeklyRevenue.labels, datasets: [{ label: 'Ingresos', data: data.weeklyRevenue.amounts, backgroundColor: 'rgba(79, 70, 229, 0.8)', borderColor: 'rgba(79, 70, 229, 1)', borderWidth: 1, borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: value => (value / 1000) + 'K' } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => `${context.dataset.label || ''}: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(context.parsed.y)}` } } } } });
            
            const occupancyCtx = document.getElementById('occupancyTypeChart')?.getContext('2d');
            if (occupancyCtx) new Chart(occupancyCtx, { type: 'doughnut', data: { labels: ['Mensualidades', 'Invitados'], datasets: [{ data: [data.occupancy.members, data.occupancy.guests], backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(234, 179, 8, 0.8)'], borderColor: ['#ffffff'], borderWidth: 4 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } } });
        };
        
        const loadDashboardData = async () => {
            setCurrentDate();
            const data = await fetchDashboardData();
            if (data) {
                updateMetricCards(data);
                createCharts(data);
            } else {
                console.error("No se pudieron cargar los datos del dashboard.");
            }
        };
        
        loadDashboardData();
        const refreshButton = document.getElementById('refresh-data');
        if (refreshButton) {
            refreshButton.addEventListener('click', loadDashboardData);
        }
    };

    // --- MANEJADORES DE MODALES ---
    const initializeModals = () => {
        // Funciones para manejar modales
        const openModal = (modalId) => {
            document.getElementById(modalId).classList.remove('hidden');
        };

        const closeModal = (modalId) => {
            document.getElementById(modalId).classList.add('hidden');
            // Limpiar formularios
            document.querySelector(`#${modalId} form`)?.reset();
        };

        // Configurar botones de cerrar modal
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('[id^="modal-"]');
                if (modal) closeModal(modal.id);
            });
        });

        // Cerrar modal al hacer clic fuera
        document.querySelectorAll('[id^="modal-"]').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal.id);
            });
        });

        // Manejar formulario de nuevo operador
        const operatorForm = document.getElementById('operator-form');
        if (operatorForm) {
            operatorForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(operatorForm);
                const operatorData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password')
                };

                try {
                    await addOperator(operatorData);
                    closeModal('modal-operator');
                    // Recargar vista de operadores
                    if (mainContent.querySelector('#operators-table')) {
                        await handleOperatorsView();
                    }
                    alert('Operador creado exitosamente');
                } catch (error) {
                    console.error('Error al crear operador:', error);
                    alert('Error al crear el operador');
                }
            });
        }

        // Manejar formulario de nueva mensualidad
        const membershipForm = document.getElementById('membership-form');
        if (membershipForm) {
            membershipForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(membershipForm);
                const membershipData = {
                    client_name: formData.get('clientName'),
                    client_email: formData.get('clientEmail'),
                    vehicle_plate: formData.get('vehiclePlate').toUpperCase(),
                    start_date: formData.get('startDate'),
                    end_date: formData.get('endDate'),
                    notification_sent: 0
                };

                try {
                    await addMembership(membershipData);
                    
                    // Enviar correo de bienvenida
                    const { subject, html } = generateMembershipEmail(membershipData);
                    await sendEmail(formData.get('email'), subject, html);
                    
                    closeModal('modal-membership');
                    // Recargar vista de mensualidades
                    if (mainContent.querySelector('#memberships-table')) {
                        await handleMembershipsView();
                    }
                    alert('Mensualidad creada exitosamente y correo enviado');
                } catch (error) {
                    console.error('Error al crear mensualidad:', error);
                    alert('Error al crear la mensualidad');
                }
            });
        }

        // Configurar botones de "Nuevo" para abrir modales
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.includes('Nuevo Operador')) {
                button.addEventListener('click', () => openModal('modal-operator'));
            } else if (button.textContent.includes('Nueva Mensualidad')) {
                button.addEventListener('click', () => openModal('modal-membership'));
            }
        });
    };

    // --- MANEJADOR DE VISTAS ---
    const renderView = (viewName) => {
        mainContent.innerHTML = views[viewName] || `<p>Vista no encontrada.</p>`;

        if (viewName === 'dashboard') {
            initializeDashboard();
        }

        // Inicializar modales después de renderizar la vista
        initializeModals();

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.view === viewName);
        });
    };

    // --- EVENT LISTENERS PARA NAVEGACIÓN ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const view = link.dataset.view;
            renderView(view);
        });
    });

    // --- CARGA INICIAL ---
    renderView('dashboard');
});

