import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { createAccount, createTenant, type AccountHP } from '@/services/account-service';

export function AccountSetupPage() {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    organization: '',
    organizationType: '',
    organizationPhone: '',
    address1: '',
    address2: '',
    city: '',
    county: '',
    state: '',
    postalCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('User not found. Please log in again.');
      return;
    }

    // Validation
    if (!formData.organization.trim()) {
      setError('Organization name is required');
      return;
    }

    if (!formData.organizationType) {
      setError('Organization type is required');
      return;
    }

    try {
      setIsSubmitting(true);

      const accountData: Omit<AccountHP, 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        email: user.email,
        organization: formData.organization.trim(),
        organizationType: formData.organizationType,
        organizationPhone: formData.organizationPhone.trim(),
        address1: formData.address1.trim(),
        address2: formData.address2.trim(),
        city: formData.city.trim(),
        county: formData.county.trim(),
        state: formData.state,
        postalCode: formData.postalCode.trim(),
      };

      // Create account (userId is used as document ID in accounts_hp)
      await createAccount(accountData);

      // Create tenant entry (userId -> accountId mapping in tenants_hp)
      await createTenant(user.id, user.id);

      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#16213e]">
      {/* Header with Logo */}
      <div className="border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/logo.svg"
              alt="HealthExtent"
              className="w-12 h-12"
            />
            <h1 className="text-2xl font-bold text-white">HealthExtent</h1>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">
              Complete Your Account Setup
            </h2>
            <p className="text-lg text-[#888888]">
              Please provide your organization information to continue
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-2xl">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Organization Information Section */}
                <div className="border-b border-[#2A2A2A] pb-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Organization Information
                  </h3>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="organization" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        Organization Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="organization"
                        id="organization"
                        required
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="Enter organization name"
                      />
                    </div>

                    <div>
                      <label htmlFor="organizationType" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        Organization Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="organizationType"
                        id="organizationType"
                        required
                        value={formData.organizationType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Select type</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Clinic">Clinic</option>
                        <option value="Practice">Practice</option>
                        <option value="Health System">Health System</option>
                        <option value="ACO">ACO</option>
                        <option value="MCO">MCO</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="organizationPhone" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="organizationPhone"
                        id="organizationPhone"
                        value={formData.organizationPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address Information
                  </h3>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="address1" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address1"
                        id="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address2" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="address2"
                        id="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label htmlFor="county" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        County
                      </label>
                      <input
                        type="text"
                        name="county"
                        id="county"
                        value={formData.county}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="County"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        State
                      </label>
                      <select
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Select state</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-[#6200EA] text-white rounded-lg hover:bg-[#7C4DFF] transition-colors font-medium"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Complete Setup'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 border border-[#2A2A2A] text-[#E0E0E0] rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>

                </div>
              </form>
            </div>
          </div>

          {/* Footer Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-[#666666]">
              Need help? Contact support at{' '}
              <a href="mailto:support@healthextent.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                support@healthextent.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
