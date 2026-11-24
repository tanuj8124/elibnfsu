import { GridFSBucket, MongoServerError, ObjectId } from "mongodb"
import { NextResponse } from "next/server"

import { getMongoClientPromise } from "@/lib/mongodb"

export const runtime = "nodejs"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const AADHAAR_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"])
const WORK_SAMPLE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
])

class ValidationError extends Error {}

function requiredText(formData: FormData, key: string, maxLength: number) {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    throw new ValidationError(`${key} is required.`)
  }

  const trimmed = value.trim()
  if (trimmed.length > maxLength) {
    throw new ValidationError(`${key} is too long.`)
  }

  return trimmed
}

function requiredFile(formData: FormData, key: string, allowedTypes: Set<string>) {
  const value = formData.get(key)

  if (!(value instanceof File) || value.size === 0) {
    throw new ValidationError(`${key} is required.`)
  }

  validateFile(value, key, allowedTypes)
  return value
}

function optionalFile(formData: FormData, key: string, allowedTypes: Set<string>) {
  const value = formData.get(key)

  if (!(value instanceof File) || value.size === 0) {
    return null
  }

  validateFile(value, key, allowedTypes)
  return value
}

function validateFile(file: File, key: string, allowedTypes: Set<string>) {
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(`${key} must be smaller than 5 MB.`)
  }

  if (!allowedTypes.has(file.type)) {
    throw new ValidationError(`${key} has an unsupported file type.`)
  }
}

function isRealDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

async function uploadFile(
  bucket: GridFSBucket,
  file: File,
  registrationId: ObjectId,
  kind: "aadhaar" | "previousWork",
) {
  const upload = bucket.openUploadStream(file.name, {
    metadata: { registrationId, kind, contentType: file.type },
  })
  const contents = Buffer.from(await file.arrayBuffer())

  await new Promise<void>((resolve, reject) => {
    upload.once("error", reject)
    upload.once("finish", () => resolve())
    upload.end(contents)
  })

  return upload.id
}

export async function POST(request: Request) {
  const uploadedFileIds: ObjectId[] = []

  try {
    const formData = await request.formData()
    const fullName = requiredText(formData, "fullName", 120)
    const dateOfBirth = requiredText(formData, "dateOfBirth", 10)
    const graduationYearText = requiredText(formData, "graduationYear", 4)
    const address = requiredText(formData, "address", 500)
    const languagesText = requiredText(formData, "languages", 250)
    const university = requiredText(formData, "university", 200)
    const email = requiredText(formData, "email", 254).toLowerCase()
    const phone = requiredText(formData, "phone", 10)
    const aadhaar = requiredFile(formData, "aadhaar", AADHAAR_TYPES)
    const previousWork = optionalFile(formData, "previousWork", WORK_SAMPLE_TYPES)

    if (!isRealDate(dateOfBirth) || dateOfBirth > "2010-12-31") {
      throw new ValidationError("Please enter a valid date of birth.")
    }

    const graduationYear = Number(graduationYearText)
    if (!Number.isInteger(graduationYear) || graduationYear < 1990 || graduationYear > 2035) {
      throw new ValidationError("Please enter a valid graduation year.")
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      throw new ValidationError("Please enter a valid Gmail address.")
    }

    if (!/^\d{10}$/.test(phone)) {
      throw new ValidationError("Please enter a valid 10-digit phone number.")
    }

    if (formData.get("linkedinVerified") !== "on" || formData.get("instagramVerified") !== "on") {
      throw new ValidationError("Both profile confirmations are required.")
    }

    const languages = languagesText.split(",").map((language) => language.trim()).filter(Boolean)
    if (languages.length === 0) {
      throw new ValidationError("Please enter at least one language.")
    }

    const client = await getMongoClientPromise()
    const db = client.db(process.env.MONGODB_DB || "registration_app")
    const registrations = db.collection("registrations")
    const files = new GridFSBucket(db, { bucketName: "registration_files" })
    const registrationId = new ObjectId()

    await registrations.createIndex({ email: 1 }, { unique: true })

    const aadhaarFileId = await uploadFile(files, aadhaar, registrationId, "aadhaar")
    uploadedFileIds.push(aadhaarFileId)

    const previousWorkFileId = previousWork
      ? await uploadFile(files, previousWork, registrationId, "previousWork")
      : null

    if (previousWorkFileId) uploadedFileIds.push(previousWorkFileId)

    await registrations.insertOne({
      _id: registrationId,
      fullName,
      dateOfBirth: new Date(`${dateOfBirth}T00:00:00.000Z`),
      graduationYear,
      address,
      languages,
      university,
      email,
      phone,
      verification: {
        linkedin: true,
        instagram: true,
      },
      files: {
        aadhaar: aadhaarFileId,
        previousWork: previousWorkFileId,
      },
      status: "submitted",
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: "Registration submitted successfully.", applicationId: registrationId.toHexString() },
      { status: 201 },
    )
  } catch (error) {
    if (uploadedFileIds.length > 0) {
      try {
        const client = await getMongoClientPromise()
        const db = client.db(process.env.MONGODB_DB || "registration_app")
        const bucket = new GridFSBucket(db, { bucketName: "registration_files" })
        await Promise.all(uploadedFileIds.map((id) => bucket.delete(id)))
      } catch {
        // Preserve the original submission error if cleanup fails.
      }
    }

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "A registration with this Gmail address already exists." },
        { status: 409 },
      )
    }

    console.error("Registration submission failed", error)
    return NextResponse.json(
      { error: "Registration could not be submitted. Please try again." },
      { status: 500 },
    )
  }
}
