// Función para exportar datos a CSV
export function exportToCSV(data, filename) {
    // Convertir los datos a formato CSV
    const csvContent = convertToCSV(data);
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Agregar encabezados
    csvRows.push(headers.join(','));
    
    // Agregar filas
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return `"${value}"`; // Envolver en comillas para manejar comas en el contenido
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

// Funciones para obtener datos de reportes
export async function getDailyOperations() {
    // Aquí iría la llamada real a la base de datos
    return [{
        fecha: '2025-10-16',
        total_ingresos: 450000,
        vehiculos: 45,
        tiempo_promedio: '2.5 horas',
        ocupacion_maxima: '85%'
    }];
}

export async function getMonthlyOperations() {
    // Aquí iría la llamada real a la base de datos
    return [{
        mes: 'Octubre 2025',
        total_ingresos: 12500000,
        total_vehiculos: 1250,
        mensualidades_activas: 85,
        ocupacion_promedio: '75%'
    }];
}

// Funciones para crear gráficos
export function createMonthlyRevenueChart(ctx, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Ingresos Mensuales',
                data: data.values,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${(value/1000000).toFixed(1)}M`
                    }
                }
            }
        }
    });
}

export function createOccupancyDistributionChart(ctx, data) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Mensualidades', 'Visitantes Frecuentes', 'Visitantes Ocasionales'],
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

export function createPeakHoursChart(ctx, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.hours,
            datasets: [{
                label: 'Ocupación',
                data: data.occupancy,
                fill: true,
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}

export function createMembershipTrendChart(ctx, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [{
                label: 'Mensualidades Activas',
                data: data.active,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
            }, {
                label: 'Mensualidades Vencidas',
                data: data.expired,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}