"use client";

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Clock,
  Link as LinkIcon,
  Send,
} from "lucide-react";
import type { JobFormValues } from "@/schemas/career.schema";
import { submitJobApplication } from "@/lib/services/site/careers";

export interface ApplyJobModalProps {
  job: JobFormValues | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyJobModal({ job, isOpen, onClose }: Readonly<ApplyJobModalProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [currentCtc, setCurrentCtc] = useState("");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("30 Days");
  const [coverLetter, setCoverLetter] = useState("");

  // Resume File
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileName = file.name.toLowerCase();
    const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      setFileError("Only PDF, DOC, and DOCX formats are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit.");
      return;
    }

    setResumeFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileName = file.name.toLowerCase();
    const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      setFileError("Only PDF, DOC, and DOCX formats are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit.");
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resumeFile) {
      setFileError("Please upload your resume (PDF or DOCX).");
      return;
    }

    if (!job.id) {
      setErrorMessage("Invalid job identifier.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
      formData.append("email", email.trim());
      if (phone.trim()) formData.append("phone", phone.trim());
      if (linkedinUrl.trim()) formData.append("linkedin_url", linkedinUrl.trim());
      if (githubUrl.trim()) formData.append("github_url", githubUrl.trim());
      if (portfolioUrl.trim()) formData.append("portfolio_url", portfolioUrl.trim());
      if (currentCtc.trim()) formData.append("current_ctc", currentCtc.trim());
      if (expectedCtc.trim()) formData.append("expected_ctc", expectedCtc.trim());
      if (noticePeriod.trim()) formData.append("notice_period", noticePeriod.trim());
      if (coverLetter.trim()) formData.append("cover_letter", coverLetter.trim());

      await submitJobApplication(job.id, formData);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || "Failed to submit your application. Please check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setFileError(null);
    setResumeFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-[#FAFAFC] border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] block">
              Application
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-0.5">{job.title}</h3>
            <p className="text-xs text-[#6B7280] mt-1">
              {job.department} • {job.job_type} • {job.workplace_type} ({job.location})
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-full text-[#6B7280] hover:text-[#111827] hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-[#111827]">Application Submitted!</h4>
            <p className="text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
              Thank you for applying for the{" "}
              <strong className="text-[#111827] font-semibold">{job.title}</strong> role at Apearix.
              Our engineering & talent team will review your application and resume shortly.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="h-11 px-6 rounded-xl bg-[#6D28F5] hover:bg-[#5B21E6] text-white text-sm font-semibold transition-colors"
              >
                Close & Return to Careers
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Candidate Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Morgan"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  Portfolio / Website
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourwork.dev"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>
            </div>

            {/* Notice & Compensation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  Notice Period
                </label>
                <select
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none bg-white"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  Current CTC / Salary
                </label>
                <input
                  type="text"
                  value={currentCtc}
                  onChange={(e) => setCurrentCtc(e.target.value)}
                  placeholder="e.g. $85,000 / ₹18 LPA"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1">
                  Expected CTC
                </label>
                <input
                  type="text"
                  value={expectedCtc}
                  onChange={(e) => setExpectedCtc(e.target.value)}
                  placeholder="e.g. $110,000 / ₹24 LPA"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
                />
              </div>
            </div>

            {/* Resume Upload Drag & Drop */}
            <div>
              <label className="text-xs font-semibold text-[#111827] block mb-1">
                Upload Resume / CV <span className="text-rose-500">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                  resumeFile
                    ? "border-emerald-400 bg-emerald-50/50"
                    : "border-[#D1D5DB] hover:border-[#6D28F5] bg-[#FAFAFC]"
                }`}
              >
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#111827] truncate max-w-xs">
                        {resumeFile.name}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drop to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <UploadCloud className="w-8 h-8 text-[#6D28F5] mx-auto" />
                    <p className="text-xs font-bold text-[#111827]">
                      Click to upload or drag & drop your resume
                    </p>
                    <p className="text-[11px] text-[#6B7280]">PDF, DOC, or DOCX up to 5MB</p>
                  </div>
                )}
              </div>

              {fileError && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{fileError}</p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="text-xs font-semibold text-[#111827] block mb-1">
                Cover Note / Why Apearix?
              </label>
              <textarea
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us briefly about what drives you and the impactful projects you have worked on..."
                className="w-full text-xs p-3 rounded-lg border border-[#E5E7EB] focus:ring-1 focus:ring-[#6D28F5] focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#4B5563] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 rounded-xl bg-[#6D28F5] hover:bg-[#5B21E6] text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
