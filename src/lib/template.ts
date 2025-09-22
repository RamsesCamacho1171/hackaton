import nodemailer from 'nodemailer'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export function generatePaymentEmailTemplate(data: {
    medicamento: string
    cantidad: number
    monto_destino: number
    moneda_destino: string
    monto_origen: number
    moneda_origen: string
    url_pago: string
}) {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
      <h2 style="color: #032A5A; font-weight: bold; margin-bottom: 20px; text-align:center;">
        Solicitud de Pago
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background-color:#f1f5f9;"><b>Medicamento</b></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.medicamento}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background-color:#f1f5f9;"><b>Cantidad</b></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.cantidad}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background-color:#f1f5f9;"><b>Monto a Pagar</b></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.monto_destino} ${data.moneda_destino}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background-color:#f1f5f9;"><b>Equivalente</b></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.monto_origen} ${data.moneda_origen}</td>
        </tr>
      </table>

      <div style="text-align: center;">
        <a href="${data.url_pago}" 
           style="display: inline-block; background-color: #14AA95; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Revisar Pago
        </a>
      </div>

      <p style="margin-top: 40px; font-size: 12px; color: #555; text-align:center;">
        Si no solicitaste este pago, puedes ignorar este correo.
      </p>
    </div>
  `
}

type PaymentRequest = {
    medicamento: string
    cantidad: number
    monto_destino: number
    moneda_destino: string
    monto_origen: number
    moneda_origen: string
    url_pago: string

}

const transporter = nodemailer.createTransport({
    service: 'gmail', // Usa otro servicio si no es Gmail
    auth: {
        user: process.env.EMAIL_SENDER, // Tu correo
        pass: process.env.EMAIL_PASSWORD, // Contraseña o App Password
    },
});


export const sendEmail = async(body: PaymentRequest, email: string) => {
    try {
        const html = generatePaymentEmailTemplate(body)

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER || '"Pagos" <no-reply@example.com>',
            to: email,
            subject: `Solicitud de Pago – ${body.medicamento}`,
            html
        })

        const cookieStore = await cookies();

        cookieStore.set(email, JSON.stringify(body), {
            maxAge: 1800,
            path: "/",
            secure: false,
            httpOnly: true,
            sameSite: "strict",
        });

        return info.messageId

    } catch (error) {
        return false;
    }
}