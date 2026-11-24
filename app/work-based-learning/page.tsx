import type { Metadata } from "next"
import { WorkBasedLearningForm } from "@/components/work-based-learning-form"

export const metadata: Metadata = {
  title: "Temporary Contractual Hindi Translation Recruitment | NFSU E-Library",
  description: "Register for the NFSU temporary contractual Hindi translation recruitment opportunity.",
}

export default function WorkBasedLearningPage() {
  return <WorkBasedLearningForm />
}
