import { Link } from 'react-router-dom';

export function HipaaPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">HIPAA Compliance Statement</h1>
          <p className="text-[#888888] mb-8">HealthExtent TCM Service</p>

          <div className="prose prose-invert max-w-none">
            <div className="text-[#E0E0E0] space-y-6">
              <p className="text-lg">
                HealthExtent LLC is committed to full compliance with the Health Insurance Portability and Accountability Act (HIPAA). The HealthExtent TCM Service is designed to securely process and manage Protected Health Information (PHI) on behalf of healthcare organizations.
              </p>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">We Maintain HIPAA Compliance Through:</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Business Associate Agreements (BAA)</h3>
                      <p className="text-[#E0E0E0]">
                        We execute BAAs with all Covered Entities to formalize our HIPAA obligations and ensure proper handling of PHI.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Encryption of Data</h3>
                      <p className="text-[#E0E0E0]">
                        All PHI is encrypted in transit using TLS 1.2+ and at rest using industry-standard encryption algorithms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Access Controls & Authentication</h3>
                      <p className="text-[#E0E0E0]">
                        Role-based access controls and multi-factor authentication ensure only authorized personnel can access PHI.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Audit Logs & Monitoring</h3>
                      <p className="text-[#E0E0E0]">
                        Comprehensive audit logging tracks all access to PHI, supporting compliance reporting and security investigations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Regular Security Assessments</h3>
                      <p className="text-[#E0E0E0]">
                        We conduct regular security assessments and penetration testing to identify and address potential vulnerabilities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Secure Hosting Infrastructure</h3>
                      <p className="text-[#E0E0E0]">
                        Our infrastructure is hosted in secure, compliant data centers that meet SOC 2 and HIPAA requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Breach Notification Procedures</h3>
                      <p className="text-[#E0E0E0]">
                        We maintain comprehensive breach notification procedures aligned with HIPAA Subpart D requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-8 bg-[#3D5AFE]/10 border border-[#3D5AFE]/20 rounded-lg p-6">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-[#3D5AFE] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-[#3D5AFE] mb-2">Important Notice</h3>
                    <p className="text-[#E0E0E0]">
                      HealthExtent supports HIPAA-compliant workflows but does not control the internal environment, policies, or usage practices of the Covered Entity. Healthcare organizations remain responsible for their own HIPAA compliance, including workforce training, internal policies, and proper use of the Service.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Questions About HIPAA Compliance?</h2>
                <p className="mb-3">
                  If you have questions about our HIPAA compliance practices or need to request a Business Associate Agreement, please contact us:
                </p>
                <div className="ml-4 space-y-1">
                  <p>Email: <a href="mailto:compliance@healthextent.ai" className="text-indigo-400 hover:text-indigo-300">compliance@healthextent.ai</a></p>
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
