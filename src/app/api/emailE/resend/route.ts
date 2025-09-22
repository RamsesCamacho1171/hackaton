import { sendEmail } from '@/lib/template'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = (await req.json())

        if (!body.email) {
            return NextResponse.json({ ok: false, error: 'El campo email es requerido' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const userCookie = cookieStore.get(body.email)

        if (!userCookie) {
            // Cookie no existe o expiró
            return NextResponse.json(
                { ok: false, error: "No se encontró (puede haber expirado o no estar seteada)" },
                { status: 401 } // 401 = no autorizado
            )
        }

        const data = JSON.parse(userCookie.value)

        const info = await sendEmail(data,body.email)

        return NextResponse.json({ ok: true, messageId: info })
    } catch (error) {
        console.error('Error enviando el correo:', error);
        return NextResponse.json({ message: 'Error al enviar el correo' }, { status: 500 });
    }
}