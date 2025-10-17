import { sendEmail, generateExpirationAlert } from './emailService.js';

// Función para verificar mensualidades próximas a vencer
export async function checkExpiringMemberships() {
    try {
        // Obtener mensualidades que vencen en los próximos 3 días
        const expiringMemberships = await getMembershipsExpiringInDays(3);
        
        // Enviar correos de notificación
        for (const membership of expiringMemberships) {
            const { subject, html } = generateExpirationAlert(membership);
            await sendEmail(membership.email, subject, html);
            
            // Marcar como notificada en la base de datos
            await updateMembershipNotificationStatus(membership.id);
        }
        
        console.log(`Se enviaron ${expiringMemberships.length} notificaciones de vencimiento`);
        return expiringMemberships.length;
    } catch (error) {
        console.error('Error al verificar mensualidades por vencer:', error);
        throw error;
    }
}

// Función para obtener mensualidades próximas a vencer
async function getMembershipsExpiringInDays(days) {
    const db = await initDB();
    return db.all(`
        SELECT 
            m.*,
            c.email
        FROM memberships m
        JOIN clients c ON m.client_id = c.id
        WHERE 
            m.end_date BETWEEN date('now') AND date('now', '+' || ? || ' days')
            AND m.notification_sent = 0
            AND m.status = 'active'
    `, [days]);
}

// Función para actualizar el estado de notificación
async function updateMembershipNotificationStatus(membershipId) {
    const db = await initDB();
    return db.run(`
        UPDATE memberships 
        SET notification_sent = 1 
        WHERE id = ?
    `, [membershipId]);
}