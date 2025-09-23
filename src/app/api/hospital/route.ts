import { NextResponse } from "next/server"

export async function GET() {
  try {
    const url =
      process.env.HOSPITALS_API_URL || "http://localhost:8081/api/hospitals"
    const user = process.env.HOSPITALS_API_USER || "root"
    const pass = process.env.HOSPITALS_API_PASS || "12345"

    // Basic Auth header: "Basic base64(username:password)"
    const authHeader =
      "Basic " + Buffer.from(`${user}:${pass}`).toString("base64")

    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
      // Evita cachear si quieres datos frescos siempre
      cache: "no-store",
    })

    if (!upstream.ok) {
      // Propaga el error de la API upstream
      return NextResponse.json(
        {
          ok: false,
          error: `Upstream error`,
          status: upstream.status,
        },
        { status: 502 }
      )
    }

    const data = await upstream.json()

    // Si necesitas transformar campos para mantener tu contrato, hazlo aquí
    // ej: mapear keys, filtrar, etc.

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Internal proxy error" },
      { status: 500 }
    )
  }
}
