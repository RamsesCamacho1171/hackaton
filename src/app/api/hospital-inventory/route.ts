import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Obligatorio
    const hospitalId = searchParams.get("hospital_id")

    // Aceptamos ambos nombres por compatibilidad: id_medicine (upstream) o medicine_id (cliente)
    const idMedicine =
      searchParams.get("id_medicine") ?? searchParams.get("medicine_id")

    if (!hospitalId) {
      return NextResponse.json(
        { ok: false, error: "El parámetro hospital_id es requerido" },
        { status: 400 }
      )
    }

    // Validación rápida: deben ser números válidos
    if (Number.isNaN(Number(hospitalId))) {
      return NextResponse.json(
        { ok: false, error: "hospital_id debe ser numérico" },
        { status: 400 }
      )
    }
    if (idMedicine != null && Number.isNaN(Number(idMedicine))) {
      return NextResponse.json(
        { ok: false, error: "id_medicine/medicine_id debe ser numérico" },
        { status: 400 }
      )
    }

    // Construir URL hacia el upstream con los NOMBRES que espera:
    // hospital_id y id_medicine
    const baseUrl =
      process.env.HOSPITAL_INVENTORY_API_URL ??
      "http://localhost:8081/api/hospital-inventory"
    const upstreamUrl = new URL(baseUrl)
    upstreamUrl.searchParams.set("hospital_id", String(hospitalId))
    if (idMedicine != null) {
      upstreamUrl.searchParams.set("id_medicine", String(idMedicine))
    }

    // (Opcional) Basic Auth, si tu backend lo requiere como en /api/hospitals
    const user = process.env.HOSPITALS_API_USER || "root"
    const pass = process.env.HOSPITALS_API_PASS || "12345"
    const authHeader = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64")

    const resp = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
      cache: "no-store", // o: next: { revalidate: 60 }
    })

    if (!resp.ok) {
      return NextResponse.json(
        { ok: false, error: "Upstream error", status: resp.status },
        { status: 502 }
      )
    }

    const data = await resp.json()
    // Si necesitas transformar claves para tu contrato, hazlo aquí antes de responder.
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    )
  }
}
