import { useState } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { updateMemberNames } from '@/services/members-service';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';

export function UserProfilePage() {
  const { user, firebaseUser } = useFirebaseAuth();
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Name form state
  const [displayName, setDisplayName] = useState(user?.name || '');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !user || !displayName.trim()) return;

    setIsUpdatingName(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const trimmedName = displayName.trim();

      // Split display name into firstName and lastName
      const nameParts = trimmedName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      console.log('Updating name:', { displayName: trimmedName, firstName, lastName });

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: trimmedName,
      });

      console.log('Firebase Auth profile updated');

      // Update members_hp collection with firstName and lastName
      await updateMemberNames(user.id, user.email, firstName, lastName);

      console.log('members_hp collection updated');

      setSuccessMessage('Name updated successfully');

      // Reload the page after a short delay to refresh the user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Error updating name:', err);
      setError(err instanceof Error ? err.message : 'Failed to update name');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Password change initiated');
    console.log('Firebase user:', firebaseUser ? 'Present' : 'Missing');
    console.log('User email:', user?.email);

    if (!firebaseUser) {
      setError('Authentication error: User not logged in');
      return;
    }

    if (!user?.email) {
      setError('Authentication error: Email not found');
      return;
    }

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log('Creating credential for re-authentication');
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      console.log('Re-authenticating user');
      await reauthenticateWithCredential(firebaseUser, credential);

      console.log('Updating password');
      // Update password
      await updatePassword(firebaseUser, newPassword);

      console.log('Password updated successfully');
      setSuccessMessage('Password updated successfully');

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password update error:', err);
      console.error('Error code:', err?.code);
      console.error('Error message:', err?.message);

      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Current password is incorrect');
      } else if (err.code === 'auth/weak-password') {
        setError('New password is too weak');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in before changing your password');
      } else if (err.code === 'auth/user-mismatch') {
        setError('Authentication error: User mismatch');
      } else {
        const errorMsg = err?.message || 'Failed to update password';
        setError(`Error: ${errorMsg}`);
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user || !firebaseUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">User Profile</h2>
        <p className="text-sm text-[#888888] mt-1">
          Manage your personal information and security settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-400">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Current Email (Read-only) */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Account Email</h3>
        <div>
          <label className="block text-sm font-medium text-[#888888] mb-2">
            Email Address
          </label>
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3">
            <p className="text-base text-[#E0E0E0]">{user.email}</p>
          </div>
          <p className="text-xs text-[#666666] mt-2">
            Email address cannot be changed. Contact support if you need to update your email.
          </p>
        </div>
      </div>

      {/* Update Display Name */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Display Name</h3>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-[#888888] mb-2">
              Full Name (First and Last)
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter your first and last name"
              required
            />
            <p className="text-xs text-[#666666] mt-2">
              This will update your display name and member profile across all organizations
            </p>
          </div>

          <button
            type="submit"
            disabled={isUpdatingName || !displayName.trim()}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-[#2A2A2A] disabled:text-[#666666] text-white rounded-lg transition-colors font-medium"
          >
            {isUpdatingName ? 'Updating...' : 'Update Name'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-[#888888] mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#888888] mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter new password (min 6 characters)"
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#888888] mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Confirm new password"
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-[#2A2A2A] disabled:text-[#666666] disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isUpdatingPassword ? 'Updating Password...' : 'Change Password'}
            </button>
          </div>

          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
            <p className="text-xs text-[#888888]">
              <strong className="text-[#E0E0E0]">Password Requirements:</strong>
            </p>
            <ul className="list-disc list-inside text-xs text-[#888888] mt-2 space-y-1">
              <li>Minimum 6 characters</li>
              <li>Must enter your current password to change</li>
              <li>New password and confirmation must match</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
