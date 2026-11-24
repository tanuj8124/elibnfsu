import type { Metadata } from "next"
import { RegistrationForm } from "@/components/simple-login"

export const metadata: Metadata = {
  title: "Create Profile",
  description: "Create a profile with your username and last name.",
}

export default function LoginPage() {
  return <RegistrationForm />
}
