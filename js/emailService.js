// Configuración del servicio de correo
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'tu-correo@gmail.com',
        pass: 'tu-contraseña-de-aplicación'
    }
};

export async function sendEmail(to, subject, html) {
    try {
        // Aquí iría la implementación real del envío de correo
        console.log('Simulando envío de correo:', { to, subject, html });
        return true;
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error;
    }
}

export function generateMembershipEmail(membershipData) {
    return {
        subject: 'Bienvenido a CrudPark - Mensualidad Registrada',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4f46e5;">¡Bienvenido a CrudPark!</h2>
                <p>Estimado/a ${membershipData.client_name},</p>
                <p>Su mensualidad ha sido registrada exitosamente con los siguientes detalles:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Placa:</strong> ${membershipData.vehicle_plate}</p>
                    <p><strong>Fecha de inicio:</strong> ${membershipData.start_date}</p>
                    <p><strong>Fecha de fin:</strong> ${membershipData.end_date}</p>
                </div>
                <p>Recuerde que recibirá una notificación cuando su mensualidad esté próxima a vencer.</p>
                <p>¡Gracias por confiar en nosotros!</p>
            </div>
        `
    };
}

export function generateExpirationAlert(membershipData) {
    return {
        subject: 'CrudPark - Su mensualidad está próxima a vencer',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Aviso de Vencimiento</h2>
                <p>Estimado/a ${membershipData.client_name},</p>
                <p>Le informamos que su mensualidad está próxima a vencer:</p>
                <div style="background: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Placa:</strong> ${membershipData.vehicle_plate}</p>
                    <p><strong>Fecha de vencimiento:</strong> ${membershipData.end_date}</p>
                </div>
                <p>Para evitar interrupciones en el servicio, por favor renueve su mensualidad antes de la fecha de vencimiento.</p>
                <p>Si ya realizó la renovación, ignore este mensaje.</p>
            </div>
        `
    };
}