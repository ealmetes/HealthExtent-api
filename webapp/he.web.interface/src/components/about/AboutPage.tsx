import { Link } from 'react-router-dom';

export function AboutPage() {
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
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            About HealthExtent
          </h1>
          <p className="text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold mb-6">
            Transforming Care Transitions Through Intelligent Automation and Real-Time Data
          </p>
          <div className="max-w-4xl mx-auto space-y-4 text-lg text-[#E0E0E0]">
            <p>
              HealthExtent is a healthcare technology company dedicated to improving the way care teams manage patient transitions after hospitalization. Our mission is simple: empower providers, care coordinators, ACOs, MSOs, and health organizations with modern tools that reduce administrative burden, improve patient outcomes, and strengthen revenue integrity.
            </p>
            <p>
              We believe every patient deserves a safe, well-coordinated transition of care—without paperwork bottlenecks, missed follow-ups, or fragmented data.
            </p>
            <p className="font-semibold text-white">
              HealthExtent brings together automation, real-time clinical data, and smart workflows to make that possible.
            </p>
          </div>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-8 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-lg text-[#E0E0E0] mb-4">
              To modernize transitional care management (TCM) by equipping healthcare teams with intelligent technology that enhances patient recovery, reduces readmissions, and supports compliance—all while simplifying everyday operations.
            </p>
            <p className="text-lg text-white font-semibold">
              We exist to bridge gaps in communication between hospitals, providers, and patients—so no one falls through the cracks.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Our Story</h2>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <p className="text-[#E0E0E0] mb-6 text-lg">
              HealthExtent was founded by healthcare integration experts who spent years working with hospitals, EHR systems, and provider organizations. We saw firsthand how:
            </p>

            <ul className="space-y-3 mb-6">
              {[
                'Discharge notifications arrive too late',
                'TCM tasks get overlooked',
                'Readmissions go undetected',
                'Care teams are overwhelmed',
                'Data exists in silos across multiple systems'
              ].map((issue, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500/20 border border-red-500/50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{issue}</span>
                </li>
              ))}
            </ul>

            <p className="text-[#E0E0E0] mb-4 text-lg">
              The lack of modern, automated tools meant that Transitional Care Management—one of CMS's most impactful programs—was underutilized.
            </p>

            <p className="text-white font-semibold text-xl mb-6">
              We created HealthExtent to change that.
            </p>

            <p className="text-[#E0E0E0] text-lg">
              Today, our platform supports real-time ADT feeds, HL7/FHIR interoperability, automated TCM workflows, AI-driven prioritization, provider dashboards, and analytics that elevate the quality and efficiency of patient care transitions.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">What We Do</h2>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <p className="text-[#E0E0E0] mb-6 text-lg">
              HealthExtent provides a <strong className="text-white">Turnkey Transitional Care Management Platform</strong> that includes:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Real-time hospital admission & discharge alerts',
                'Automated TCM workflows and compliance tracking',
                'Intelligent patient prioritization',
                'Provider and care coordinator dashboards',
                'Outreach documentation tools',
                'Medicare TCM billing support',
                'HL7 and FHIR integration engine',
                'Patient record matching & readmission detection',
                'Secure, HIPAA-compliant cloud infrastructure',
                'Enterprise analytics for MSOs, ACOs, and health systems'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{feature}</span>
                </div>
              ))}
            </div>

            <p className="text-white font-medium text-lg mt-6">
              Every feature is designed to reduce manual workload and ensure patients are followed closely after leaving the hospital.
            </p>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Who We Serve</h2>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <p className="text-[#E0E0E0] mb-6 text-lg">
              HealthExtent is built for organizations dedicated to improving post-acute care coordination:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                'Physician practices',
                'Multi-specialty groups',
                'Hospitals & health systems',
                'ACOs / MSSP organizations',
                'MSOs / Value-based care networks',
                'Behavioral health providers',
                'Transitional care teams',
                'Home health & care management teams'
              ].map((org, idx) => (
                <div key={idx} className="bg-[#242832] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3 hover:border-indigo-500 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{org}</span>
                </div>
              ))}
            </div>

            <p className="text-white font-medium text-lg">
              Whether you manage dozens or thousands of patient transitions per month, HealthExtent scales with you.
            </p>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Our Expertise</h2>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <p className="text-[#E0E0E0] mb-6 text-lg">
              HealthExtent's team has deep experience in:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'HL7 v2, FHIR R4, and clinical interoperability',
                'Mirth Connect and integration engines',
                'TCM coding & compliance requirements',
                'Care coordination workflows',
                'Hospital ADT event processing',
                'Healthcare data security & HIPAA compliance',
                'Provider workflow optimization',
                'AI-driven analytics for risk and prioritization'
              ].map((expertise, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{expertise}</span>
                </div>
              ))}
            </div>

            <p className="text-white font-medium text-lg mt-6">
              We combine technical excellence with frontline healthcare insight.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '1', title: 'Patient-Centered Care', desc: 'Technology should serve people—and improve the journey from hospital to home.' },
              { num: '2', title: 'Simplicity', desc: 'Workflows should be intuitive, not complex.' },
              { num: '3', title: 'Transparency', desc: 'Clear data, clear communication, clear insights.' },
              { num: '4', title: 'Innovation', desc: 'We embrace modern cloud architecture, real-time data, and intelligent automation.' },
              { num: '5', title: 'Partnership', desc: 'We work closely with practices, hospitals, and care teams to deliver real-world results.' }
            ].map((value, idx) => (
              <div key={idx} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  {value.num}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-[#888888]">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Vision */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-8 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>

            <p className="text-lg text-white mb-6 font-semibold">
              To become the nation's leading Transition-of-Care platform—connecting hospitals, providers, and patients through real-time, intelligent, and interoperable care coordination technology.
            </p>

            <p className="text-[#E0E0E0] mb-4 text-lg">A future where:</p>

            <ul className="space-y-2">
              {[
                'Care teams don\'t chase data',
                'Patients don\'t get lost after discharge',
                'Readmissions drop',
                'Providers maximize TCM as intended',
                'Technology handles the complexity so humans can deliver the care'
              ].map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0] text-lg">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Security */}
        <section className="mb-16">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Built on Trust & Security</h2>
            </div>

            <p className="text-[#E0E0E0] mb-6 text-lg">
              HealthExtent is committed to data protection and compliance:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                'HIPAA-compliant infrastructure',
                'End-to-end data encryption',
                'Access control & audit logging',
                'Secure ADT/FHIR pipelines',
                'Business Associate Agreements (BAAs) with all partners'
              ].map((security, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#E0E0E0]">{security}</span>
                </div>
              ))}
            </div>

            <p className="text-white font-semibold text-lg">
              Your trust is our highest priority.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="mb-16">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Where We Are</h2>
            </div>

            <p className="text-[#E0E0E0] text-lg mb-4">
              HealthExtent is headquartered in <strong className="text-white">Tamarac, Florida</strong>, with customers, partners, and integrations across the United States.
            </p>

            <p className="text-[#E0E0E0] text-lg">
              Our platform is cloud-based and built to scale—whether supporting a small practice or a large multi-state network.
            </p>
          </div>
        </section>

        {/* Connect With Us */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              We would love to partner with your organization to improve transitional care and patient outcomes.
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-3 justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href="https://www.healthextent.ai" className="text-white hover:text-indigo-200 font-medium">
                    www.healthextent.ai
                  </a>
                </div>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-3 justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@healthextent.ai" className="text-white hover:text-indigo-200 font-medium">
                    support@healthextent.ai
                  </a>
                </div>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-3 justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <a href="mailto:developers@healthextent.ai" className="text-white hover:text-indigo-200 font-medium">
                    developers@healthextent.ai
                  </a>
                </div>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-3 justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <a href="mailto:sales@healthextent.ai" className="text-white hover:text-indigo-200 font-medium">
                    sales@healthextent.ai
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 text-lg bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all shadow-xl font-semibold"
              >
                Contact Us Today
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 text-lg border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold"
              >
                Request a Demo
              </Link>
            </div>
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
