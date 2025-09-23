import { NextResponse } from "next/server"

type Params = { id: string }

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params

    // Validación rápida
    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        { ok: false, error: "Param id must be a numeric provider id" },
        { status: 400 }
      )
    }

    // Construye la URL upstream y pasa cualquier query extra que venga en la llamada
    const base =
      process.env.PROVIDER_MEDICINES_API_URL ??
      "http://localhost:8081/api/provider-medicines"
    const upstreamUrl = new URL(`${base}/${encodeURIComponent(id)}`)

    // Si tu endpoint acepta query params (e.g. ?page=1), los propagamos:
    const { searchParams } = new URL(req.url)
    searchParams.forEach((v, k) => upstreamUrl.searchParams.set(k, v))

    // Basic Auth (reutiliza las mismas creds)
    const user = process.env.HOSPITALS_API_USER || "root"
    const pass = process.env.HOSPITALS_API_PASS || "12345"
    const authHeader = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64")

    const resp = await fetch(upstreamUrl.toString(), {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!resp.ok) {
      return NextResponse.json(
        { ok: false, error: "Upstream error", status: resp.status },
        { status: 502 }
      )
    }

    const data = await resp.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    )
  }
}
