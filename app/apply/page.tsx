"use client";

import { useState } from "react";
import Link from "next/link";

interface FormData {
  // Personal
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;

  // Qualifications
  basicOpsClass: string;
  mondayTraining: string;

  // Military
  militaryService: string;
  militaryBranch: string;
  dischargeStatus: string;
  dd214: string;

  // Medical credentials
  medicalLicense: string;
  medicalLicenseType: string;
  medicalLicenseNumber: string;
  medicalLicenseExpiration: string;
  medicalDisclaimer: string;

  // Background
  convictedMisdemeanor: string;
  misdemeanorExplanation: string;
  convictedFelony: string;
  felonyExplanation: string;
  moralTurpitude: string;
  moralTurpitudeExplanation: string;

  // Signature
  signature: string;
  signatureDate: string;
}

const EMPTY: FormData = {
  firstName: "", lastName: "", dob: "", address: "", city: "", state: "", zip: "", phone: "", email: "",
  basicOpsClass: "", mondayTraining: "",
  militaryService: "", militaryBranch: "", dischargeStatus: "", dd214: "",
  medicalLicense: "", medicalLicenseType: "", medicalLicenseNumber: "", medicalLicenseExpiration: "", medicalDisclaimer: "",
  convictedMisdemeanor: "", misdemeanorExplanation: "",
  convictedFelony: "", felonyExplanation: "",
  moralTurpitude: "", moralTurpitudeExplanation: "",
  signature: "", signatureDate: "",
};

type Status = "idle" | "submitting" | "success" | "error";

/* ─── Small reusable field components ─────────────────────────────────────── */

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#9ca3af", fontFamily: "var(--font-body)" }}>
      {children} {required && <span style={{ color: "#8B0000" }}>*</span>}
    </label>
  );
}

function Input({ name, value, onChange, type = "text", placeholder, required }: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 text-white text-sm outline-none transition-colors"
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "var(--font-body)",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#8B0000")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    />
  );
}

function Textarea({ name, value, onChange, placeholder, rows = 3 }: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 text-white text-sm outline-none transition-colors resize-none"
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "var(--font-body)",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#8B0000")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    />
  );
}

function RadioGroup({ name, value, onChange, options }: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-6">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="accent-red-700 w-4 h-4"
          />
          <span className="text-sm text-gray-300" style={{ fontFamily: "var(--font-body)" }}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-5 mb-8">
      <div
        className="shrink-0 flex items-center justify-center w-10 h-10 font-display font-bold text-white"
        style={{ background: "#8B0000", fontFamily: "var(--font-display)", fontSize: "1rem" }}
      >
        {number}
      </div>
      <div>
        <h2 className="font-display text-white uppercase" style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700 }}>
          {title}
        </h2>
        {subtitle && <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-8 mb-2"
      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px my-6" style={{ background: "rgba(139,0,0,0.2)" }} />;
}

function DisclaimerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 mt-4" style={{ background: "#0d0d0d", border: "1px solid rgba(139,0,0,0.4)", borderLeft: "4px solid #8B0000" }}>
      <p className="text-xs leading-relaxed" style={{ color: "#9ca3af", fontFamily: "var(--font-body)" }}>
        {children}
      </p>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function ApplyPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Age validation
  function getAge(dob: string) {
    if (!dob) return 0;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (getAge(form.dob) < 18) {
      setErrorMsg("You must be at least 18 years of age to apply.");
      return;
    }
    if (!form.medicalDisclaimer && form.medicalLicense === "yes") {
      setErrorMsg("You must acknowledge the medical services disclaimer to proceed.");
      return;
    }
    if (!form.signature.trim()) {
      setErrorMsg("Please provide your electronic signature to submit.");
      return;
    }

    setErrorMsg("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0A", paddingTop: "8rem" }}>
        <div className="wrap text-center max-w-lg">
          <div className="text-6xl mb-6">🚒</div>
          <h1 className="font-display text-white uppercase mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700 }}>
            Application Received
          </h1>
          <p className="text-gray-400 mb-8" style={{ fontFamily: "var(--font-body)", lineHeight: 1.75 }}>
            Thank you for your interest in serving with Villa Hills Fire Protection District.
            Your application has been submitted and a copy has been sent to our department.
            We will be in touch with you shortly.
          </p>
          <Link href="/" className="btn-fire">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* PAGE HEADER */}
      <section
        style={{ background: "#8B0000", paddingTop: "7rem", paddingBottom: "3rem", overflow: "hidden" }}
      >
        <div className="wrap">
          <p className="text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-4" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>
            Villa Hills Fire Protection District
          </p>
          <h1
            className="font-display text-white uppercase"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 700, lineHeight: 0.9 }}
          >
            Volunteer Application
          </h1>
          <p className="mt-4 text-white/70 max-w-xl" style={{ fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
            Complete all sections below. All information is kept confidential and reviewed
            only by authorized department personnel.
          </p>
        </div>
      </section>

      {/* FORM */}
      <div style={{ background: "#0A0A0A", paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap" style={{ maxWidth: "860px" }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* ── SECTION 1: Personal Information ── */}
            <Section>
              <SectionHeader number="1" title="Personal Information" subtitle="All fields are required unless noted." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label required>First Name</Label>
                  <Input name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <Label required>Last Name</Label>
                  <Input name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
                <div>
                  <Label required>Date of Birth</Label>
                  <Input name="dob" value={form.dob} onChange={handleChange} type="date" required />
                  {form.dob && getAge(form.dob) < 18 && (
                    <p className="text-xs mt-2" style={{ color: "#8B0000" }}>Applicants must be at least 18 years of age.</p>
                  )}
                </div>
                <div>
                  <Label required>Phone Number</Label>
                  <Input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="(618) 555-0100" required />
                </div>
                <div className="sm:col-span-2">
                  <Label required>Email Address</Label>
                  <Input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" required />
                </div>
                <div className="sm:col-span-2">
                  <Label required>Street Address</Label>
                  <Input name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street" required />
                </div>
                <div>
                  <Label required>City</Label>
                  <Input name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label required>State</Label>
                    <Input name="state" value={form.state} onChange={handleChange} placeholder="IL" required />
                  </div>
                  <div>
                    <Label required>ZIP Code</Label>
                    <Input name="zip" value={form.zip} onChange={handleChange} placeholder="62220" required />
                  </div>
                </div>
              </div>
            </Section>

            {/* ── SECTION 2: Qualifications ── */}
            <Section>
              <SectionHeader number="2" title="General Qualifications" />

              <div className="mb-7">
                <Label required>Have you completed a Basic Operations Firefighter course through the State of Illinois?</Label>
                <RadioGroup name="basicOpsClass" value={form.basicOpsClass} onChange={handleChange}
                  options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "Currently enrolled", value: "enrolled" }]}
                />
              </div>

              <Divider />

              <div>
                <Label required>Are you available to attend Monday night training sessions on a regular basis?</Label>
                <RadioGroup name="mondayTraining" value={form.mondayTraining} onChange={handleChange}
                  options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "Most of the time", value: "most" }]}
                />
              </div>
            </Section>

            {/* ── SECTION 3: Military Service ── */}
            <Section>
              <SectionHeader number="3" title="Military Service" subtitle="Villa Hills Fire Protection District proudly welcomes veterans." />

              <div className="mb-7">
                <Label required>Have you served in or are you currently serving in the United States Armed Forces?</Label>
                <RadioGroup name="militaryService" value={form.militaryService} onChange={handleChange}
                  options={[{ label: "Yes — Veteran", value: "yes" }, { label: "Yes — Currently Serving", value: "active" }, { label: "No", value: "no" }]}
                />
              </div>

              {(form.militaryService === "yes" || form.militaryService === "active") && (
                <>
                  <Divider />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label>Branch of Service</Label>
                      <Input name="militaryBranch" value={form.militaryBranch} onChange={handleChange}
                        placeholder="e.g. Army, Navy, Marines, Air Force, Coast Guard, Space Force" />
                    </div>
                    {form.militaryService === "yes" && (
                    <div>
                      <Label>Discharge Status</Label>
                      <Input name="dischargeStatus" value={form.dischargeStatus} onChange={handleChange}
                        placeholder="e.g. Honorable, General, Other Than Honorable" />
                    </div>
                    )}
                    {form.militaryService === "yes" && (
                    <div className="sm:col-span-2">
                      <Label>DD-214 Status</Label>
                      <RadioGroup name="dd214" value={form.dd214} onChange={handleChange}
                        options={[
                          { label: "I have my DD-214", value: "have" },
                          { label: "I do not have my DD-214", value: "nothave" },
                          { label: "In process / pending", value: "pending" },
                        ]}
                      />
                    </div>
                    )}
                  </div>
                </>
              )}
            </Section>

            {/* ── SECTION 4: Medical Credentials ── */}
            <Section>
              <SectionHeader number="4" title="Medical Credentials" subtitle="Illinois licensed medical providers only." />

              <div className="mb-7">
                <Label required>Are you a licensed First Responder, EMT, or Paramedic through the State of Illinois?</Label>
                <RadioGroup name="medicalLicense" value={form.medicalLicense} onChange={handleChange}
                  options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                />
              </div>

              {form.medicalLicense === "yes" && (
                <>
                  <Divider />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                    <div>
                      <Label>License Type</Label>
                      <Input name="medicalLicenseType" value={form.medicalLicenseType} onChange={handleChange}
                        placeholder="First Responder / EMT / Paramedic" />
                    </div>
                    <div>
                      <Label>License Number</Label>
                      <Input name="medicalLicenseNumber" value={form.medicalLicenseNumber} onChange={handleChange} placeholder="IL-XXXXXXXX" />
                    </div>
                    <div>
                      <Label>Expiration Date</Label>
                      <Input name="medicalLicenseExpiration" value={form.medicalLicenseExpiration} onChange={handleChange} type="date" />
                    </div>
                  </div>

                  <DisclaimerBox>
                    <strong className="text-white block mb-2">⚠️ Important Medical Services Disclaimer</strong>
                    Villa Hills Fire Protection District is <strong className="text-white">not a licensed non-transport EMS agency</strong> and
                    does not operate as a licensed medical provider. Any medical care rendered by members at an incident
                    is limited to what is covered under the <strong className="text-white">Illinois Good Samaritan Act</strong> — meaning care
                    provided as a trained individual acting in good faith, not as a licensed provider acting in an official
                    agency capacity. Members with medical licensure may render aid consistent with Good Samaritan protections,
                    but do so as individuals, not as representatives of the District in a licensed medical capacity.
                  </DisclaimerBox>

                  <label className="flex items-start gap-3 cursor-pointer mt-5">
                    <input
                      type="checkbox"
                      name="medicalDisclaimer"
                      checked={form.medicalDisclaimer === "yes"}
                      onChange={(e) => setForm((prev) => ({ ...prev, medicalDisclaimer: e.target.checked ? "yes" : "" }))}
                      className="mt-1 accent-red-700 w-4 h-4 shrink-0"
                    />
                    <span className="text-sm text-gray-400" style={{ fontFamily: "var(--font-body)" }}>
                      I understand that Villa Hills Fire Protection District is not a licensed non-transport EMS agency,
                      and that any medical care I render at incidents is limited to what is covered under the Illinois
                      Good Samaritan Act, and is provided as an individual — not in a licensed agency capacity.
                    </span>
                  </label>
                </>
              )}
            </Section>

            {/* ── SECTION 5: Background ── */}
            <Section>
              <SectionHeader number="5" title="Background Information" subtitle="Answer all questions honestly. A conviction does not automatically disqualify an applicant." />

              <div className="mb-7">
                <Label required>Have you ever been convicted of a misdemeanor?</Label>
                <RadioGroup name="convictedMisdemeanor" value={form.convictedMisdemeanor} onChange={handleChange}
                  options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                />
                {form.convictedMisdemeanor === "yes" && (
                  <div className="mt-4">
                    <Label>Please explain (charge, date, jurisdiction, disposition)</Label>
                    <Textarea name="misdemeanorExplanation" value={form.misdemeanorExplanation} onChange={handleChange}
                      placeholder="Provide details about the offense..." rows={3} />
                  </div>
                )}
              </div>

              <Divider />

              <div className="mb-7">
                <Label required>Have you ever been convicted of a felony?</Label>
                <RadioGroup name="convictedFelony" value={form.convictedFelony} onChange={handleChange}
                  options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                />
                {form.convictedFelony === "yes" && (
                  <div className="mt-4">
                    <Label>Please explain (charge, date, jurisdiction, disposition)</Label>
                    <Textarea name="felonyExplanation" value={form.felonyExplanation} onChange={handleChange}
                      placeholder="Provide details about the offense..." rows={3} />
                  </div>
                )}
              </div>

              <Divider />

              <div>
                <Label required>Have you ever been convicted of any offense involving moral turpitude?</Label>
                <p className="text-xs text-gray-600 mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  Moral turpitude offenses generally include crimes involving dishonesty, fraud, theft, or conduct contrary to community standards of justice.
                </p>
                <RadioGroup name="moralTurpitude" value={form.moralTurpitude} onChange={handleChange}
                  options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                />
                {form.moralTurpitude === "yes" && (
                  <div className="mt-4">
                    <Label>Please explain (charge, date, jurisdiction, disposition)</Label>
                    <Textarea name="moralTurpitudeExplanation" value={form.moralTurpitudeExplanation} onChange={handleChange}
                      placeholder="Provide details about the offense..." rows={3} />
                  </div>
                )}
              </div>
            </Section>

            {/* ── SECTION 6: Signature ── */}
            <Section>
              <SectionHeader number="6" title="Certification & Signature" />
              <DisclaimerBox>
                I certify that all information provided in this application is true and complete to the best of my knowledge.
                I understand that any misrepresentation or omission of facts may result in disqualification from consideration
                or, if discovered after appointment, may be grounds for dismissal. I authorize Villa Hills Fire Protection
                District to conduct any investigation necessary to verify the information provided.
              </DisclaimerBox>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                <div>
                  <Label required>Electronic Signature (Type full legal name)</Label>
                  <Input name="signature" value={form.signature} onChange={handleChange}
                    placeholder="Your full legal name" required />
                </div>
                <div>
                  <Label required>Date</Label>
                  <Input name="signatureDate" value={form.signatureDate} onChange={handleChange} type="date" required />
                </div>
              </div>
            </Section>

            {/* Error */}
            {errorMsg && (
              <div className="p-4 mb-4" style={{ background: "rgba(139,0,0,0.15)", border: "1px solid rgba(139,0,0,0.5)" }}>
                <p className="text-sm" style={{ color: "#f87171", fontFamily: "var(--font-body)" }}>{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-fire"
                style={{ fontSize: "1rem", padding: "1rem 2.5rem", opacity: status === "submitting" ? 0.6 : 1 }}
              >
                {status === "submitting" ? "Submitting…" : "Submit Application"}
                {status !== "submitting" && (
                  <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <Link href="/join" className="btn-outline">Back to Join Page</Link>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
