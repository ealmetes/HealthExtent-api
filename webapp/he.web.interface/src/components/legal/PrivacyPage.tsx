import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#16213e]">
      {/* Navigation */}
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.svg"
                alt="HealthExtent"
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-white">HealthExtent</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 text-sm text-[#E0E0E0] hover:text-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-[#888888] mb-8">Last Updated: December 4, 2025</p>

          <div className="prose prose-invert max-w-none">
            <div className="text-[#E0E0E0] space-y-6">
              <p>
                This Privacy Policy explains how HealthExtent LLC ("HealthExtent," "we," "us," "our") collects, uses, and protects information processed through the HealthExtent Transitional Care Management (TCM) Service ("Service"). This policy applies to healthcare organizations, authorized users, and any entity that interacts with the Service.
              </p>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p className="mb-4">We may collect and process:</p>

                <div className="ml-4 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">a. Protected Health Information (PHI)</h3>
                    <p className="mb-3">Provided by healthcare organizations, including:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Patient demographics (name, date of birth, address)</li>
                      <li>Encounter and admission/discharge data (HL7 ADT, ORU, FHIR)</li>
                      <li>Provider contact information</li>
                      <li>Diagnosis, treatment codes, and care plan documentation</li>
                      <li>Notes, outreach attempts, TCM timeline records</li>
                      <li>Attachments, PDFs, and clinical transitions data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">b. User Information</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Name and email</li>
                      <li>Login credentials</li>
                      <li>Organization affiliation</li>
                      <li>Usage logs, audit logs, access history</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">c. Technical Information</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>IP address</li>
                      <li>Device information</li>
                      <li>Application logs</li>
                      <li>System performance and analytics</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Information</h2>
                <p className="mb-3">HealthExtent uses data exclusively to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Deliver and maintain the TCM platform</li>
                  <li>Provide analytics, dashboards, and workflow automation</li>
                  <li>Enable TCM outreach, follow-up, and compliance tracking</li>
                  <li>Improve performance, stability, and product features</li>
                  <li>Support customer service, troubleshooting, and security</li>
                  <li>Meet legal and contractual obligations</li>
                </ul>
                <p className="mt-3 font-semibold">
                  We do not sell patient data or use PHI for marketing.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing</h2>
                <p className="mb-3">We may share data with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Authorized users within your organization</li>
                  <li>Subprocessors under a signed BAA (e.g., hosting providers, cloud infrastructure)</li>
                  <li>Regulators or authorities if required by law</li>
                  <li>Your organization's EHR, PMS, or integration endpoints based on your configuration</li>
                </ul>
                <p className="mt-3 font-semibold">
                  No PHI is shared with third parties except as permitted under HIPAA and business agreements.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                <p className="mb-3">
                  HealthExtent implements technical, administrative, and physical safeguards, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption in transit (TLS 1.2+) and at rest</li>
                  <li>Role-based access controls</li>
                  <li>Audit logging and monitoring</li>
                  <li>Network segmentation and firewalls</li>
                  <li>Secure data centers compliant with SOC 2, HIPAA, and industry standards</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
                <p className="mb-3">PHI is retained only as long as:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Necessary to provide the Service</li>
                  <li>Required under your organization's contract</li>
                  <li>Required by federal or state regulations</li>
                </ul>
                <p className="mt-3">
                  Upon termination, data is securely returned or destroyed as defined in the BAA.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Your Responsibilities</h2>
                <p className="mb-3">Organizations using the Service must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Obtain required patient authorizations</li>
                  <li>Ensure correct data entry and access control</li>
                  <li>Maintain HIPAA compliance within their own systems</li>
                  <li>Notify HealthExtent of any suspected security incidents</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Contact</h2>
                <div className="ml-4 space-y-1">
                  <p>Email: <a href="mailto:privacy@healthextent.ai" className="text-indigo-400 hover:text-indigo-300">privacy@healthextent.ai</a></p>
                  <p>Website: <a href="https://www.healthextent.ai" className="text-indigo-400 hover:text-indigo-300">https://www.healthextent.ai</a></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[#888888]">
          <p>&copy; 2025 HealthExtent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
