"use client"

import { FormEvent, useState } from "react"
import { UserRound } from "lucide-react"
import Image from "next/image"

export function RegistrationForm() {
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.reportValidity()) return

    const data = new FormData(form)
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.get("username"),
          lastName: data.get("lastName"),
        }),
      })
      const result = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) throw new Error(result.error || "Profile could not be saved. Please try again.")

      setIsError(false)
      setMessage(result.message || "Profile saved successfully.")
      form.reset()
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="registration-title">
        <div className="" aria-hidden="true">

          <Image src="/iglogo.png" alt="Zeta logo" width={50} height={300} />
        </div>
        <div className="login-heading">
          <h1 id="registration-title">Log into zeta</h1>
          <p></p>
        </div>

        <form className="login-form" onSubmit={handleRegistration}>
          <label className="login-field">
            <span>Username</span>
            <span className="login-input-wrap">
              <UserRound size={19} aria-hidden="true" />
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Enter your username"
                required
              />
            </span>
          </label>

          <label className="login-field">
            <span>Last name</span>
            <span className="login-input-wrap">
              <UserRound size={19} aria-hidden="true" />
              <input
                type="text"
                name="lastName"
                autoComplete="family-name"
                placeholder="Enter your last name"
                required
              />
            </span>
          </label>

        <a>forget password?</a>
          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "logging…" : "Login"}
          </button>

          {message && <p className={`login-message ${isError ? "is-error" : "is-success"}`} role="status">{message}</p>}
        </form>
        <div className="w-full flex justify-center pt-2">

        <Image className="" src="/metalogo.png" alt="Meta" width={50} height={20} />
        </div>
      </section>
    </main>
  )
}
