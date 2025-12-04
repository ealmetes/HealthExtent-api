import { Link } from 'react-router-dom';

export function TermsPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-[#888888] mb-8">Last Updated: December 4, 2025</p>

          <div className="prose prose-invert max-w-none">
            <div className="text-[#E0E0E0] space-y-6">
              <p>
                These Terms of Service ("Terms") govern your use of the HealthExtent Transitional Care Management (TCM) Service ("Service"), a platform designed to support healthcare organizations in managing post-discharge care transitions, monitoring patient follow-ups, and improving care coordination. By accessing or using the Service, you agree to be bound by these Terms.
              </p>

              <p className="font-semibold text-white">
                If you do not agree with these Terms, do not use the Service.
              </p>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Purpose of the HealthExtent TCM Service</h2>
                <p className="mb-3">
                  The TCM Service assists healthcare providers, clinics, ACOs, MSOs, and hospitals in managing transitional care workflows, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Receiving and processing hospital discharge notifications</li>
                  <li>Tracking patient status following discharge</li>
                  <li>Supporting outreach, follow-ups, and TCM regulatory timeframes</li>
                  <li>Providing dashboards, analytics, and communication tools</li>
                  <li>Helping organizations meet CMS TCM documentation and billing requirements</li>
                </ul>
                <p className="mt-3 font-semibold">
                  HealthExtent is not a healthcare provider and does not deliver medical advice, diagnosis, or treatment.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
                <p className="mb-3">The Service may only be used by:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Licensed healthcare professionals</li>
                  <li>Authorized staff within a healthcare organization</li>
                  <li>Users who have been provisioned accounts by an organization with an active HealthExtent subscription</li>
                </ul>
                <p className="mt-3">
                  You must comply with all applicable federal and state healthcare regulations, including HIPAA.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                <p className="mb-3">You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the Service only for lawful, healthcare-related operational purposes.</li>
                  <li>Ensure all information you enter into the system is accurate and complete.</li>
                  <li>Protect login credentials and prevent unauthorized access.</li>
                  <li>Comply with all patient privacy and security laws.</li>
                  <li>Maintain proper clinical judgment and oversight—HealthExtent does NOT replace clinical decision-making.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Usage and Patient Information</h2>
                <p className="mb-3">The TCM Service may process the following types of data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>ADT/HL7/FHIR hospital event data</li>
                  <li>Patient demographic and encounter information</li>
                  <li>Care transition status, notes, and documentation</li>
                  <li>Audit logs, communication logs, and system-generated insights</li>
                </ul>
                <p className="mt-3 mb-3">HealthExtent:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Does not sell patient data.</li>
                  <li>Uses data solely to provide and improve the Service.</li>
                  <li>Implements administrative, physical, and technical safeguards consistent with HIPAA.</li>
                </ul>
                <p className="mt-3">
                  Each organization remains the Covered Entity and is responsible for ensuring that all data submitted is lawful and compliant.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. No Medical Advice</h2>
                <p className="mb-3">
                  The Service provides workflow automation, notifications, AI-assisted suggestions, analytics, and documentation support, but:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Does not make clinical decisions</li>
                  <li>Should not be used as a substitute for professional medical judgment</li>
                  <li>Does not guarantee patient outcomes</li>
                </ul>
                <p className="mt-3">
                  You acknowledge that all care decisions remain the responsibility of licensed clinicians.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Service Availability and System Changes</h2>
                <p className="mb-3">HealthExtent strives to maintain high platform availability; however:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The Service may experience downtime for maintenance, upgrades, or unforeseen issues.</li>
                  <li>HealthExtent reserves the right to modify features, content, or functionality at any time.</li>
                  <li>HealthExtent is not liable for delays, data unavailability, or performance issues outside our control.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Billing and Subscription Terms</h2>
                <p className="mb-3">
                  Use of the TCM Service requires an active subscription agreement between HealthExtent and your organization. Terms may include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Monthly or annual subscription fees</li>
                  <li>Pay-per-patient or pay-per-discharge pricing</li>
                  <li>Usage-based billing</li>
                  <li>Contract-specific service-level commitments</li>
                </ul>
                <p className="mt-3">
                  Failure to pay may result in account suspension or termination.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>
                <p className="mb-3">
                  All software, analytics, text, graphics, AI models, workflow logic, and technology powering the TCM Service are the intellectual property of HealthExtent LLC.
                </p>
                <p className="mb-3">You may not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copy, distribute, or modify the Service</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Use the Service to develop competing products</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Limitations of Liability</h2>
                <p className="mb-3">To the maximum extent permitted by law:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>HealthExtent is not liable for indirect, incidental, special, or consequential damages.</li>
                  <li>HealthExtent is not responsible for clinical errors, missed outreach attempts, delayed follow-ups, or billing inaccuracies.</li>
                  <li>The Service is provided "as-is" without warranties of any kind.</li>
                  <li>Your organization assumes full responsibility for the accuracy of patient data, clinical workflows, and billing compliance.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
                <p className="mb-3">HealthExtent may suspend or terminate access to the Service if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You violate these Terms</li>
                  <li>Your organization's subscription lapses</li>
                  <li>Unauthorized access or misuse is detected</li>
                </ul>
                <p className="mt-3">
                  You may stop using the Service at any time.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Business Associate Agreement (BAA)</h2>
                <p className="mb-3">
                  A valid BAA between HealthExtent LLC and your organization is required if you upload, store, or exchange Protected Health Information (PHI). The BAA governs:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Permitted uses of PHI</li>
                  <li>Security safeguards</li>
                  <li>Breach notification policies</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
                <p>
                  We may update these Terms periodically. Continued use of the Service constitutes acceptance of changes. The most current version will always be posted on our website.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
                <p className="mb-3">
                  For questions about these Terms or the TCM Service, contact:
                </p>
                <div className="ml-4 space-y-1">
                  <p className="font-semibold text-white">HealthExtent LLC</p>
                  <p>Email: <a href="mailto:support@healthextent.ai" className="text-indigo-400 hover:text-indigo-300">support@healthextent.ai</a></p>
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
