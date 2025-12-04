import { Link } from 'react-router-dom';

export function FeaturesPage() {
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
                to="/contact"
                className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Platform Features
          </h1>
          <p className="text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold mb-6">
            Transforming Care Transitions With Automation, Intelligence & Compliance
          </p>
          <p className="text-xl text-[#E0E0E0] max-w-4xl mx-auto">
            HealthExtent is a modern Transitional Care Management (TCM) platform designed to help healthcare organizations improve patient outcomes, reduce readmissions, and streamline post-discharge workflows. Our platform combines automation, real-time hospital event ingestion, AI-driven insights, and compliance tools—built for practices, ACOs, MSOs, hospitals, and care coordination teams.
          </p>
        </div>

        {/* Core Platform Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Core Platform Features</h2>
          </div>

          <div className="grid gap-6">
            {/* Feature 1 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">1. Real-Time Hospital Event Alerts</h3>
              <p className="text-[#E0E0E0] mb-4">
                Instantly receive ADT (Admission, Discharge, Transfer) notifications from participating hospitals and health systems.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Includes:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>Direct HL7 & FHIR integration</li>
                  <li>Automated patient matching</li>
                  <li>Real-time dashboard updates</li>
                  <li>Readmission detection</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Care teams know immediately when their patients are admitted or discharged—closing critical communication gaps.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">2. Automated TCM Workflow Engine</h3>
              <p className="text-[#E0E0E0] mb-4">
                Manage all Transitional Care Management (TCM) requirements in one place.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Workflow automation includes:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>48-hour contact window tracking</li>
                  <li>7- and 14-day follow-up timeframes</li>
                  <li>Auto-generated TCM task lists</li>
                  <li>Outreach documentation</li>
                  <li>Visit completion and compliance tracking</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Never miss a TCM deadline again. The platform ensures your team stays compliant and coordinated.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">3. Unified Care Transition Dashboard</h3>
              <p className="text-[#E0E0E0] mb-4">
                A single view to monitor all patients moving through the care transition lifecycle.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Dashboard displays:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>New admissions & discharges</li>
                  <li>Overdue outreach alerts</li>
                  <li>Pending follow-ups</li>
                  <li>Readmission flags</li>
                  <li>Provider-specific worklists</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Care coordinators can prioritize workload instantly.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">4. Intelligent Patient Prioritization (AI-Assisted)</h3>
              <p className="text-[#E0E0E0] mb-4">
                Our AI analyzes clinical data and patient history to highlight cases needing urgent attention.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">AI evaluates:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>Readmission risk</li>
                  <li>Diagnosis complexity</li>
                  <li>Recent utilization patterns</li>
                  <li>Missed follow-ups</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Focus your care team on the patients who need help now.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">5. Outreach & Communication Tools</h3>
              <p className="text-[#E0E0E0] mb-4">
                Document every interaction with ease.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Support for:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>Phone call logs</li>
                  <li>SMS, secure messaging (optional add-on)</li>
                  <li>Outreach attempts and outcomes</li>
                  <li>Escalation routing</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Full audit trail for compliance and billing justification.</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">6. Integrated Provider Task Lists</h3>
              <p className="text-[#E0E0E0] mb-4">
                Each provider gets a personalized view of:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4 mb-4">
                <li>Assigned patients</li>
                <li>Outstanding TCM actions</li>
                <li>Required follow-ups</li>
                <li>Visit types and deadlines</li>
              </ul>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Providers see exactly what they need to do—no more missed steps.</p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">7. Medicare TCM Billing Support</h3>
              <p className="text-[#E0E0E0] mb-4">
                Automatically generate billing-ready TCM documentation.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Includes:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>CPT 99495 & 99496 validation</li>
                  <li>Completed requirements checklist</li>
                  <li>Visit documentation summary</li>
                  <li>Export to EHR or billing systems</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Maximizes revenue while ensuring compliance.</p>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">8. HL7 & FHIR Data Integration Engine</h3>
              <p className="text-[#E0E0E0] mb-4">
                HealthExtent ingests and transforms hospital data into clean, usable records.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Capabilities:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>ADT/HL7 v2 feed ingestion</li>
                  <li>FHIR R4 APIs</li>
                  <li>EHR interoperability</li>
                  <li>Custom rules engine</li>
                  <li>Mirth-powered translation layer</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Seamless integration with clinical systems and workflows.</p>
              </div>
            </div>

            {/* Feature 9 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">9. Patient Record Matching & Deduplication</h3>
              <p className="text-[#E0E0E0] mb-4">
                Our platform ensures accuracy even across fragmented datasets.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Features include:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>Automated MRN matching</li>
                  <li>Intelligent fuzzy matching</li>
                  <li>Duplicate resolution tools</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Clean, reliable patient data across every workflow.</p>
              </div>
            </div>

            {/* Feature 10 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">10. Readmission Monitoring & Alerts</h3>
              <p className="text-[#E0E0E0] mb-4">
                Detect 30-day readmissions automatically—critical for quality metrics.
              </p>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Enables proactive outreach and compliance with CMS guidelines.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Compliance Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Security & Compliance Features</h2>
          </div>

          <div className="grid gap-6">
            {/* Feature 11 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-green-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">11. HIPAA-Compliant Infrastructure</h3>
              <p className="text-[#E0E0E0] mb-4">
                Your data is protected with industry-leading safeguards:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4 mb-4">
                <li>Encryption in transit & at rest</li>
                <li>Role-based access control</li>
                <li>Activity & audit logs</li>
                <li>PHI isolation layers</li>
                <li>SOC 2 and HIPAA-aligned cloud hosting</li>
              </ul>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Enterprise-grade security for organizations of all sizes.</p>
              </div>
            </div>

            {/* Feature 12 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-green-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">12. Role-Based Access & Multi-Organization Support</h3>
              <p className="text-[#E0E0E0] mb-4">
                Fine-grained control for practices, MSOs, and enterprise clients:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4 mb-4">
                <li>Admin, Coordinator, Provider roles</li>
                <li>Multi-location support</li>
                <li>Tenant isolation</li>
              </ul>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Scales with your organization's structure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reporting & Analytics Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Reporting & Analytics Features</h2>
          </div>

          <div className="grid gap-6">
            {/* Feature 13 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-blue-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">13. TCM Performance Analytics</h3>
              <p className="text-[#E0E0E0] mb-4">
                Track TCM program outcomes in real time.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#888888] mb-2">Reports include:</p>
                <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                  <li>Outreach completion rates</li>
                  <li>48-hour compliance</li>
                  <li>Follow-up visit performance</li>
                  <li>Readmission statistics</li>
                  <li>Billing eligibility reports</li>
                </ul>
              </div>
            </div>

            {/* Feature 14 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-blue-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">14. Operational Metrics Dashboard</h3>
              <p className="text-[#E0E0E0] mb-4">
                Monitor operational efficiency:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                <li>Coordinator workload</li>
                <li>Average outreach time</li>
                <li>Patient trends</li>
                <li>Encounter volume patterns</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Integration Features</h2>
          </div>

          <div className="grid gap-6">
            {/* Feature 15 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-orange-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">15. EHR & PMS Integration Options</h3>
              <p className="text-[#E0E0E0] mb-4">
                HealthExtent integrates with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4 mb-4">
                <li>Epic</li>
                <li>Cerner</li>
                <li>Athenahealth</li>
                <li>eClinicalWorks</li>
                <li>NextGen</li>
                <li>Dentrix / Dental PMS</li>
                <li>Custom APIs</li>
              </ul>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <p className="text-sm text-green-400"><strong>Benefit:</strong> Fits directly into existing workflows.</p>
              </div>
            </div>

            {/* Feature 16 */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-orange-500 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">16. API Access <span className="text-sm text-yellow-500">(Coming Soon)</span></h3>
              <p className="text-[#E0E0E0] mb-4">
                Developers can securely access:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                <li>Encounter data</li>
                <li>Outreach logs</li>
                <li>TCM status</li>
                <li>Event activity</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why HealthExtent */}
        <section className="mb-16 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Why HealthExtent?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Built for Real Care Teams</h3>
              <p className="text-[#E0E0E0] mb-3">We designed HealthExtent with feedback from:</p>
              <ul className="list-disc list-inside space-y-1 text-[#E0E0E0] ml-4">
                <li>Care coordinators</li>
                <li>Transitional care nurses</li>
                <li>Physicians</li>
                <li>MSOs / ACO operations leaders</li>
              </ul>
            </div>

            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Automation + Intelligence = Outcome Improvement</h3>
              <p className="text-[#E0E0E0]">
                Reduce manual workload while improving patient recovery after hospitalization.
              </p>
            </div>

            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Revenue Maximization</h3>
              <p className="text-[#E0E0E0]">
                Most practices underuse TCM billing. We make billing easy, compliant, and profitable.
              </p>
            </div>

            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Proactive, Not Reactive</h3>
              <p className="text-[#E0E0E0]">
                Get ahead of readmissions—don't respond after the damage is done.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your TCM Program?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            HealthExtent helps your team deliver better care, faster, with full compliance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 text-lg bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all shadow-xl font-semibold"
            >
              Book a Demo
            </Link>
            <Link
              to="/signup"
              className="px-8 py-4 text-lg border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold"
            >
              Start a Free Trial
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 text-lg border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold"
            >
              Request Pricing
            </Link>
          </div>
        </section>
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
