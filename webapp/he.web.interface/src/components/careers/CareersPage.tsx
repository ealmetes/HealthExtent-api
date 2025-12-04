import { Link } from 'react-router-dom';

export function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#16213e]">
      {/* Navigation */}
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="HealthExtent Logo"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-white">HealthExtent</span>
            </Link>
            <Link
              to="/"
              className="text-[#888888] hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-[#888888] max-w-3xl mx-auto">
            Help us transform healthcare transitions and improve patient outcomes across the continuum of care.
          </p>
        </div>

        {/* Why Work at HealthExtent */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Work at HealthExtent?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Meaningful Impact</h3>
              <p className="text-[#888888]">
                Your work directly improves patient care during critical transitions. Every feature you build, every problem you solve helps healthcare providers deliver better outcomes.
              </p>
            </div>

            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Innovation & Growth</h3>
              <p className="text-[#888888]">
                Work with cutting-edge healthcare technology, AI/ML models, and modern development practices. We invest in your professional development and encourage continuous learning.
              </p>
            </div>

            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Collaborative Culture</h3>
              <p className="text-[#888888]">
                Join a team of passionate healthcare and technology professionals who value collaboration, open communication, and mutual respect.
              </p>
            </div>

            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-indigo-500 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Work-Life Balance</h3>
              <p className="text-[#888888]">
                We believe in sustainable success. Flexible work arrangements, competitive benefits, and a supportive environment help you thrive both professionally and personally.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Value</h2>
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Patient-First Mindset</h3>
                  <p className="text-[#888888]">Every decision we make considers the impact on patient care and outcomes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Excellence & Quality</h3>
                  <p className="text-[#888888]">We hold ourselves to the highest standards in everything we build and deliver.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Continuous Learning</h3>
                  <p className="text-[#888888]">Healthcare and technology evolve rapidly. We embrace change and invest in growing our skills.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Transparency & Trust</h3>
                  <p className="text-[#888888]">We communicate openly, admit mistakes, and build trust through consistent action.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Diversity & Inclusion</h3>
                  <p className="text-[#888888]">Different perspectives make us stronger. We welcome and celebrate diverse backgrounds and experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Openings</h2>
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-12 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-[#888888] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-white mb-3">No Open Positions at This Time</h3>
              <p className="text-[#888888] max-w-2xl mx-auto mb-8">
                We're not actively hiring right now, but we're always interested in connecting with talented individuals who are passionate about healthcare technology.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <p className="text-white mb-4">Interested in future opportunities?</p>
              <a
                href="mailto:careers@healthextent.ai?subject=Career Interest at HealthExtent"
                className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Send Us Your Resume
              </a>
              <p className="text-[#888888] text-sm mt-4">
                Email us at <a href="mailto:careers@healthextent.ai" className="text-indigo-400 hover:text-indigo-300">careers@healthextent.ai</a> to stay in touch.
              </p>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">When We're Hiring: What to Expect</h2>
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Application Review</h3>
                <p className="text-[#888888]">We carefully review every application to understand your experience and interest in healthcare technology.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Initial Conversation</h3>
                <p className="text-[#888888]">A casual phone or video chat to discuss your background, our mission, and mutual fit.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3. Technical/Skills Assessment</h3>
                <p className="text-[#888888]">Depending on the role, we may ask you to complete a practical exercise or discuss your approach to relevant challenges.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4. Team Interviews</h3>
                <p className="text-[#888888]">Meet with team members to discuss collaboration, problem-solving, and how you'd contribute to our mission.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5. Offer & Onboarding</h3>
                <p className="text-[#888888]">If it's a great match, we'll extend an offer and welcome you to the team with comprehensive onboarding.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Based in Tamarac, Florida</h2>
          <p className="text-[#888888] mb-6">
            We're located in South Florida with flexible work arrangements. We value in-person collaboration while supporting remote and hybrid work options.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#888888]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Tamarac, FL</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Hybrid & Remote Options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-[#888888] text-sm">
            <p className="mb-2">&copy; 2025 HealthExtent. All rights reserved.</p>
            <div className="flex justify-center gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/hipaa" className="hover:text-white transition-colors">HIPAA</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
