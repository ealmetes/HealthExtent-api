import { Link } from 'react-router-dom';

export function DevelopersPage() {
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
                Request API Access
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Developers
          </h1>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
            Build powerful integrations with HealthExtent's comprehensive API and data integration platform
          </p>
        </div>

        {/* Integration Overview */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Integration Overview</h2>
          </div>

          <p className="text-[#E0E0E0] mb-6">
            HealthExtent supports multiple integration models depending on your environment and data sources:
          </p>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2A2A2A]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Integration Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">HL7 v2 ADT Ingestion</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Receive A01 (admission), A03 (discharge), A04/A08 updates directly from hospital or HIE.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">FHIR R4 API Integration</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Pull patient, encounter, and observation data from EHRs such as Epic, Cerner, Athena, ECW, and more.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">REST APIs (HealthExtent API)</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Push or pull data programmatically: patients, encounters, admissions, outreach status, TCM documentation.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Secure File Drop (SFTP)</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Bulk ingest CSV/JSON files for patient and encounter data.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Webhook Event Delivery</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Receive real-time notifications for patient events from HealthExtent.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Custom Connectors</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Mirth/Interface engine integrations for nonstandard systems.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Supported EHR & PMS Systems */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Supported EHR & PMS Systems</h2>
          <p className="text-[#E0E0E0] mb-6">HealthExtent integrates with:</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {['Epic', 'Cerner', 'Meditech', 'Athenahealth', 'eClinicalWorks', 'NextGen', 'Greenway', 'Allscripts', 'Hospital ADT feeds (HL7 2.x)', 'Any FHIR-enabled system'].map((system, idx) => (
              <div key={idx} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3 hover:border-indigo-500 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#E0E0E0]">{system}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#3D5AFE]/10 border border-[#3D5AFE]/20 rounded-lg p-4">
            <p className="text-[#E0E0E0]">
              <strong className="text-[#3D5AFE]">Note:</strong> Custom integration support is available for MSOs, ACOs, and enterprise groups.
            </p>
          </div>
        </section>

        {/* Event Ingestion */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Event Ingestion: Admission, Discharge, Readmission</h2>

          <p className="text-[#E0E0E0] mb-6">
            HealthExtent's TCM engine is powered by real-time hospital events:
          </p>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2A2A2A]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Event Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Source</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Admission (ADT A01)</td>
                    <td className="px-6 py-4 text-sm text-[#888888]">HL7 Feed</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Patient admitted to inpatient observation or ED.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Discharge (ADT A03)</td>
                    <td className="px-6 py-4 text-sm text-[#888888]">HL7 Feed</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Patient discharged and transition-of-care workflow begins.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Registration (A04)</td>
                    <td className="px-6 py-4 text-sm text-[#888888]">HL7 Feed</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Patient is registered for outpatient/clinic encounters.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Update (A08)</td>
                    <td className="px-6 py-4 text-sm text-[#888888]">HL7 Feed</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Demographic or visit detail changes.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Readmission Detection</td>
                    <td className="px-6 py-4 text-sm text-[#888888]">Internal logic</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Automatic matching of admissions occurring within 30 days.</td>
                  </tr>
                  <tr className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">Procedures</td>
                    <td className="px-6 py-4 text-sm text-[#888888]">HL7 Feed / API</td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">Clinical procedures and interventions performed during encounter.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">These events trigger:</h3>
            <ul className="space-y-2">
              {['TCM outreach tasks', '48-hour contact requirements', 'Follow-up visit scheduling', 'TCM coding eligibility (99495/99496)', 'Provider assignment workflow'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* REST API */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">HealthExtent REST API</h2>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-[#888888]">Base URL:</span>
              <code className="px-3 py-1 bg-[#0A0A0A] border border-[#3D5AFE] rounded text-indigo-400 font-mono text-sm">
                https://api.healthextent.ai/v1
              </code>
            </div>
            <p className="text-sm text-[#888888]">OAuth2 / API Key authentication required.</p>
          </div>

          {/* API Endpoints */}
          <div className="space-y-6">
            {/* Patient API */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">1. Patient API</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/patients</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Create or Update a Patient</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded">GET</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/patients/{'{patientId}'}</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Get Patient Details</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded">GET</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/patients?mrn=12345&dob=YYYY-MM-DD</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Search Patients</p>
                </div>
              </div>
            </div>

            {/* Admission & Discharge Events API */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">2. Admission & Discharge Events API</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/events/admission</code>
                  </div>
                  <p className="text-sm text-[#888888] mb-3 ml-16">Record an Admission Event</p>
                  <div className="ml-16 bg-[#0A0A0A] border border-[#2A2A2A] rounded p-4 overflow-x-auto">
                    <pre className="text-xs text-[#E0E0E0] font-mono">
{`{
  "patientId": "123",
  "mrn": "HCAFNH685196",
  "eventDate": "2025-01-10T15:20:00Z",
  "facility": "HCA Florida Northwest Hospital",
  "providerId": "3698521470",
  "room": "5N-252-B"
}`}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/events/discharge</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Record a Discharge Event</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/events/readmission</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Record a Readmission</p>
                </div>
              </div>
            </div>

            {/* Encounter API */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">3. Encounter API</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/encounters</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Create an Encounter</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded">GET</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/encounters/{'{encounterId}'}</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Get Encounter Details</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-mono rounded">PUT</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/encounters/{'{encounterId}'}/status</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Update Encounter Status</p>
                </div>
              </div>
            </div>

            {/* TCM Workflow API */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">4. TCM Workflow API</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded">GET</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/tcm/{'{patientId}'}/status</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Get TCM Status for a Patient</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/tcm/outreach</code>
                  </div>
                  <p className="text-sm text-[#888888] mb-3 ml-16">Record Outreach Attempt</p>
                  <div className="ml-16 bg-[#0A0A0A] border border-[#2A2A2A] rounded p-4 overflow-x-auto">
                    <pre className="text-xs text-[#E0E0E0] font-mono">
{`{
  "patientId": "123",
  "encounterId": "456",
  "type": "phone_call",
  "attemptStatus": "reached_patient",
  "timestamp": "2025-02-01T10:34:00Z",
  "notes": "Confirmed medication changes and follow-up needs."
}`}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/tcm/complete</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Complete TCM Visit</p>
                </div>
              </div>
            </div>

            {/* Provider API */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">5. Provider API</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded">GET</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/providers</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Get Provider List</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                    <code className="text-[#E0E0E0] font-mono text-sm">/providers/assign</code>
                  </div>
                  <p className="text-sm text-[#888888] ml-16">Assign Provider to Encounter</p>
                </div>
              </div>
            </div>

            {/* Webhooks API */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">6. Webhooks API</h3>
              <p className="text-[#888888] mb-4">Allow external systems to receive HealthExtent notifications.</p>
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded">POST</span>
                  <code className="text-[#E0E0E0] font-mono text-sm">/webhooks/register</code>
                </div>
                <p className="text-sm text-[#888888] ml-16">Register Webhook</p>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white mb-2">Example events:</p>
                <ul className="space-y-1">
                  {['patient.admitted', 'patient.discharged', 'tcm.overdue', 'tcm.readmission', 'outreach.completed', 'billing.eligible'].map((event, idx) => (
                    <li key={idx} className="text-sm text-indigo-400 font-mono">• {event}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FHIR Integration */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">HealthExtent FHIR Integration Support</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">FHIR Endpoints Supported</h3>
              <ul className="space-y-2">
                {['/Patient', '/Encounter', '/Condition', '/Observation', '/MedicationRequest', '/AllergyIntolerance', '/CarePlan'].map((endpoint, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <code className="text-indigo-400 font-mono text-sm">{endpoint}</code>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-white">SMART-on-FHIR</h3>
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded">Coming Soon</span>
              </div>
              <p className="text-[#888888]">
                Enhanced FHIR capabilities with SMART-on-FHIR authorization workflows will be available soon.
              </p>
            </div>
          </div>
        </section>

        {/* Mirth Connect */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Mirth Connect & Interface Engine Support</h2>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
            <p className="text-[#E0E0E0] mb-4">HealthExtent provides:</p>
            <ul className="space-y-2 mb-6">
              {['Prebuilt channels for ADT A01, A03, A04, A08 ingestion', 'JSON transformation templates', 'FHIR-to-HealthExtent mapping scripts', 'Validations and error handling'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#888888] italic">These are available to enterprise customers upon request.</p>
          </div>
        </section>

        {/* Security */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Security for Developers</h2>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
            <p className="text-[#E0E0E0] mb-4">All integrations follow:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {['OAuth2.0 / JWT Authentication', 'TLS 1.2+ Encryption', 'Token expiration & refresh', 'IP Whitelisting (optional)', 'PHI encryption at rest', 'Audit log tracking'].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Resources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Developer Resources</h2>
          <p className="text-[#E0E0E0] mb-6">All developers get access to:</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['API Reference Documentation', 'Sample Code (Node.js, Python, C#, Java)', 'Test Sandbox Environment', 'HL7 Sample Messages', 'FHIR Mapping Guides', 'Postman Collection', 'Webhook Testing Tools'].map((resource, idx) => (
              <div key={idx} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-4 hover:border-indigo-500 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0] text-sm">{resource}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Get Started */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Get Started</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Request API Access', desc: 'Email: developers@healthextent.ai' },
              { num: '2', title: 'Receive Access to Sandbox', desc: 'We provide test patients, encounters, and sample ADT messages.' },
              { num: '3', title: 'Build Your Integration', desc: 'Use our REST, HL7, or FHIR adapters.' },
              { num: '4', title: 'Move to Production', desc: 'After certification review, gain access to the production environment.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#888888]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partner CTA */}
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Partner With HealthExtent
          </h2>
          <p className="text-xl text-indigo-100 mb-6">
            Whether you're integrating:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['A hospital HL7 feed', 'An EHR system', 'A provider network', 'A care coordination platform', 'An MSO/ACO management app'].map((item, idx) => (
              <span key={idx} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
                {item}
              </span>
            ))}
          </div>
          <p className="text-lg text-indigo-100 mb-8">
            HealthExtent provides the tools to build real-time, compliant, and scalable integrations.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 text-lg bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all shadow-xl font-semibold"
          >
            Contact Developer Relations
          </Link>
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
