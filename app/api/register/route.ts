import { NextResponse } from "next/server"

import { getMongoClientPromise } from "@/lib/mongodb"

export const runtime = "nodejs"

type LoginProfileRequest = {
  username?: unknown
  lastName?: unknown
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginProfileRequest
    const { username, lastName } = body

    if (typeof username !== "string" || !username.trim()) {
      return NextResponse.json({ error: "Username is required." }, { status: 400 })
    }

    if (typeof lastName !== "string" || !lastName.trim()) {
      return NextResponse.json({ error: "Last name is required." }, { status: 400 })
    }

    const client = await getMongoClientPromise()
    const db = client.db(process.env.MONGODB_DB || "registration_app")

    const result = await db.collection("login_profiles").insertOne({
      // Store both strings exactly as received. Do not trim, normalize, or change case.
      username,
      lastName,
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Profile saved successfully.",
        profileId: result.insertedId.toHexString(),
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request data." }, { status: 400 })
    }

    console.error("Login profile could not be saved", error)
    return NextResponse.json(
      { error: "Profile could not be saved. Please try again." },
      { status: 500 },
    )
  }
}
