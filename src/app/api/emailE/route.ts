import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { sendEmail } from '@/lib/template';

type PaymentRequest = {
    medicamento: string
    cantidad: number
    monto_destino: number
    moneda_destino: string
    monto_origen: number
    moneda_origen: string
    url_pago: string
    email: string // destinatario
}



export async function POST(req: Request) {
    try {
        const body = (await req.json()) as PaymentRequest

        if (!body.email) {
            return NextResponse.json({ ok: false, error: 'El campo email es requerido' }, { status: 400 })
        }

        const info = await sendEmail(body,body.email)

        return NextResponse.json({ ok: true, messageId: info })
    } catch (error) {
        console.error('Error enviando el correo:', error);
        return NextResponse.json({ message: 'Error al enviar el correo' }, { status: 500 });
    }
}