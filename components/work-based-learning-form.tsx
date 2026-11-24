"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Check,
  FileCheck2,
  GraduationCap,
  LockKeyhole,
  UploadCloud,
} from "lucide-react"

type Step = 1 | 2

const emptyPersonalDetails = {
  fullName: "",
  dateOfBirth: "",
  graduationYear: "",
  address: "",
  languages: "",
  university: "",
}

export function WorkBasedLearningForm() {
  const [step, setStep] = useState<Step>(1)
  const [submitted, setSubmitted] = useState(false)
  const [personalDetails, setPersonalDetails] = useState(emptyPersonalDetails)
  const [aadhaarName, setAadhaarName] = useState("")
  const [previousWorkName, setPreviousWorkName] = useState("")
  const [instagramOpened, setInstagramOpened] = useState(false)
  const [instagramConfirmed, setInstagramConfirmed] = useState(false)
  const [instagramWarning, setInstagramWarning] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState("")

  function updatePersonalDetail(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget
    setPersonalDetails((current) => ({ ...current, [name]: value }))
  }

  function selectAadhaar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    const tooLarge = Boolean(file && file.size > 5 * 1024 * 1024)
    event.currentTarget.setCustomValidity(tooLarge ? "Please choose an Aadhaar file smaller than 5 MB." : "")
    setAadhaarName(tooLarge ? "File is larger than 5 MB" : file?.name ?? "")
  }

  function selectPreviousWork(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    const tooLarge = Boolean(file && file.size > 5 * 1024 * 1024)
    event.currentTarget.setCustomValidity(tooLarge ? "Please choose a work sample smaller than 5 MB." : "")
    setPreviousWorkName(tooLarge ? "File is larger than 5 MB" : file?.name ?? "")
  }

  function confirmInstagram(event: ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked && !instagramOpened) {
      setInstagramConfirmed(false)
      setInstagramWarning("Please click “Open Instagram” before ticking this confirmation.")
      return
    }

    setInstagramConfirmed(event.currentTarget.checked)
    setInstagramWarning("")
  }

  function continueToVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (event.currentTarget.reportValidity()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (form.reportValidity()) {
      setIsSubmitting(true)
      setSubmissionError("")

      const formData = new FormData(form)
      Object.entries(personalDetails).forEach(([key, value]) => formData.set(key, value))

      try {
        const response = await fetch("/api/registrations", {
          method: "POST",
          body: formData,
        })
        const result = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(result?.error || "Registration could not be submitted. Please try again.")
        }

        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } catch (error) {
        setSubmissionError(error instanceof Error ? error.message : "Registration submitted. get back to you soon")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="application-shell">
      <div className="application-topline" />
      <header className="application-header">
        <div className="application-header-inner">
          <Link className="application-brand" href="/" aria-label="Return to NFSU e-Library">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-7gm0thPZNvlohywweVMIWvQQH3uqph.png"
              alt="National Forensic Sciences University crest"
              width={64}
              height={76}
              className="application-crest"
              unoptimized
            />
            <span>
              <small>National Forensic Sciences University</small>
              <b>E-Library</b>
            </span>
          </Link>
          <Link className="back-to-library" href="/">
            <ArrowLeft aria-hidden="true" size={15} /> Back to e-Library
          </Link>
        </div>
      </header>

      <main className="application-main">
        <section className="application-intro">
          <div className="application-eyebrow"><span /> CONTRACTUAL OPPORTUNITY</div>
          <h1>Hindi translation<br /><em>recruitment</em></h1>
          <p>Apply for the temporary contractual Hindi translation opportunity and complete profile verification.</p>
          <div className="application-facts">
            <span><CalendarDays size={15} /> Registration is open</span>
            <span><LockKeyhole size={15} /> Your details are handled securely</span>
          </div>
        </section>

        <section className="application-panel" aria-live="polite">
          {!submitted ? (
            <>
              <div className="form-progress" aria-label={`Application progress: step ${step} of 2`}>
                <div className={`progress-item ${step >= 1 ? "is-active" : ""}`}>
                  <span>{step > 1 ? <Check size={15} /> : "1"}</span>
                  <div><b>Personal & academic</b><small>Your essential details</small></div>
                </div>
                <div className="progress-line"><i className={step === 2 ? "is-complete" : ""} /></div>
                <div className={`progress-item ${step === 2 ? "is-active" : ""}`}>
                  <span>2</span>
                  <div><b>Contact & verification</b><small>Documents and profiles</small></div>
                </div>
              </div>

              {step === 1 ? (
                <form className="application-form" onSubmit={continueToVerification}>
                  <div className="form-heading">
                    <span className="form-heading-icon"><GraduationCap size={21} /></span>
                    <div><small>STEP 1 OF 2</small><h2>Personal and academic details</h2><p>All fields on this page are required.</p></div>
                  </div>

                  <div className="form-grid">
                    <label className="form-field form-field-wide">
                      <span>Full name <i>*</i></span>
                      <input name="fullName" type="text" autoComplete="name" placeholder="Enter your full name" value={personalDetails.fullName} onChange={updatePersonalDetail} required />
                    </label>
                    <label className="form-field">
                      <span>Date of birth <i>*</i></span>
                      <input name="dateOfBirth" type="date" autoComplete="bday" max="2010-12-31" value={personalDetails.dateOfBirth} onChange={updatePersonalDetail} required />
                    </label>
                    <label className="form-field">
                      <span>Graduation year <i>*</i></span>
                      <input name="graduationYear" type="number" min="1990" max="2035" inputMode="numeric" placeholder="e.g. 2027" value={personalDetails.graduationYear} onChange={updatePersonalDetail} required />
                    </label>
                    <label className="form-field form-field-wide">
                      <span>Residential address <i>*</i></span>
                      <textarea name="address" autoComplete="street-address" rows={4} placeholder="House / flat, street, city, state and PIN code" value={personalDetails.address} onChange={updatePersonalDetail} required />
                    </label>
                    <label className="form-field">
                      <span>Languages known <i>*</i></span>
                      <input name="languages" type="text" placeholder="e.g. Hindi, English, Gujarati" value={personalDetails.languages} onChange={updatePersonalDetail} required />
                      <small>Separate multiple languages with commas.</small>
                    </label>
                    <label className="form-field">
                      <span>University / institution <i>*</i></span>
                      <input name="university" type="text" autoComplete="organization" placeholder="Enter your university name" value={personalDetails.university} onChange={updatePersonalDetail} required />
                    </label>
                  </div>

                  <div className="form-actions form-actions-end">
                    <button className="primary-form-button" type="submit">Continue to page 2 <ArrowRight size={16} /></button>
                  </div>
                </form>
              ) : (
                <form className="application-form" onSubmit={submitRegistration}>
                  <div className="form-heading">
                    <span className="form-heading-icon"><BadgeCheck size={21} /></span>
                    <div><small>STEP 2 OF 2</small><h2>Contact and verification</h2><p>Complete the required fields and profile checks.</p></div>
                  </div>

                  <div className="form-grid">
                    <label className="form-field">
                      <span>Gmail ID <i>*</i></span>
                      <input name="email" type="email" autoComplete="email" placeholder="yourname@gmail.com" pattern="^[^\s@]+@gmail\.com$" title="Please enter a valid Gmail address ending in @gmail.com" required />
                    </label>
                    <label className="form-field">
                      <span>Phone number <i>*</i></span>
                      <input name="phone" type="tel" autoComplete="tel" inputMode="numeric" placeholder="10-digit mobile number" pattern="[0-9]{10}" title="Please enter a 10-digit phone number" required />
                    </label>
                    <label className="form-field file-field">
                      <span>Aadhaar document <i>*</i></span>
                      <span className="file-control"><UploadCloud size={20} /><span><b>{aadhaarName || "Choose Aadhaar file"}</b><small>PDF, JPG or PNG · max 5 MB</small></span></span>
                      <input name="aadhaar" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={selectAadhaar} required />
                    </label>
                    <label className="form-field file-field">
                      <span>Previous work <em>Optional</em></span>
                      <span className="file-control"><FileCheck2 size={20} /><span><b>{previousWorkName || "Choose work sample"}</b><small>PDF, DOC, DOCX, JPG or PNG · max 5 MB</small></span></span>
                      <input name="previousWork" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={selectPreviousWork} />
                    </label>
                  </div>

                  <fieldset className="social-verification">
                    <legend>Social media profile verification</legend>
                    <p>Open each platform, confirm your public profile is up to date, then tick both required confirmations.</p>
                    <div className="social-grid">
                      <div className="social-card linkedin-card">
                        <span className="social-icon"><BriefcaseBusiness size={23} /></span>
                        <div><b>LinkedIn profile</b><small>Review your professional and academic details.</small></div>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Open LinkedIn <ArrowRight size={15} /></a>
                        <label className="social-check"><input type="checkbox" name="linkedinVerified" required /><span><Check size={13} /></span>I confirm my LinkedIn profile <i>*</i></label>
                      </div>
                      <div className="social-card instagram-card">
                        <span className="social-icon"><Camera size={23} /></span>
                        <div><b>Instagram profile</b><small>Review your profile before confirming.</small></div>
                        <a
                          href="https://www.instagram.com/"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setInstagramOpened(true)
                            setInstagramWarning("")
                          }}
                        >
                          {instagramOpened ? "Instagram opened" : "Open Instagram"} <ArrowRight size={15} />
                        </a>
                        <label className="social-check"><input type="checkbox" name="instagramVerified" checked={instagramConfirmed} onChange={confirmInstagram} required /><span><Check size={13} /></span>I opened Instagram and reviewed my profile <i>*</i></label>
                        {instagramWarning && <p className="social-warning" role="alert">{instagramWarning}</p>}
                      </div>
                    </div>
                  </fieldset>

                  <p className="privacy-note"><LockKeyhole size={14} /> Your registration and selected documents will be uploaded and stored after submission.</p>
                  {submissionError && <p className="submission-error" role="alert">{submissionError}</p>}
                  <div className="form-actions">
                    <button className="secondary-form-button" type="button" disabled={isSubmitting} onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }) }}><ArrowLeft size={15} /> Previous page</button>
                    <button className="primary-form-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit registration"} {!isSubmitting && <ArrowRight size={16} />}</button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="submission-success">
              <span className="success-icon"><Check size={32} strokeWidth={1.8} /></span>
              <div className="application-eyebrow text-red-500"><span /> REGISTRATION FAILED SOCIAL MEDIA NOT VERIFIED!</div>
              <h2>Try again later.</h2>
              <p>Your interest in the temporary contractual Hindi translation recruitment has not been recorded. The university team will share next steps through your registered Gmail address.</p>
              <Link href="/" className="primary-form-button">Return to e-Library <ArrowRight size={16} /></Link>
            </div>
          )}
        </section>
      </main>

      <footer className="application-footer">
        <span>© 2026 National Forensic Sciences University</span>
        <span>Knowledge. Discovery. Justice.</span>
      </footer>
    </div>
  )
}
