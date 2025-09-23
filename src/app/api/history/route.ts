import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // 1) Leer y validar hospital_id
    const hospitalId = searchParams.get("hospital_id")
    if (!hospitalId) {
      return NextResponse.json(
        { ok: false, error: "El parámetro hospital_id es requerido" },
        { status: 400 }
      )
    }
    if (Number.isNaN(Number(hospitalId))) {
      return NextResponse.json(
        { ok: false, error: "hospital_id debe ser numérico" },
        { status: 400 }
      )
    }

    // 2) Construir URL upstream (propagamos otros query params si vinieran)
    const base =
      process.env.HISTORY_API_URL || "http://localhost:8081/api/history"
    const upstreamUrl = new URL(base)
    upstreamUrl.searchParams.set("hospital_id", String(hospitalId))
    // Propaga cualquier otro query param (p. ej. ?from=...&to=...)
    searchParams.forEach((v, k) => {
      if (k !== "hospital_id") upstreamUrl.searchParams.set(k, v)
    })

    // 3) Basic Auth (mismas credenciales que usaste antes)
    const user = process.env.HOSPITALS_API_USER || "root"
    const pass = process.env.HOSPITALS_API_PASS || "12345"
    const authHeader = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64")

    // 4) Llamada upstream
    const resp = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
      cache: "no-store", // o usa: next: { revalidate: 60 }
    })

    if (!resp.ok) {
      return NextResponse.json(
        { ok: false, error: "Upstream error", status: resp.status },
        { status: 502 }
      )
    }

    const data = await resp.json()

    // 5) (Opcional) transformar campos aquí si necesitas un contrato distinto

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    )
  }
}
