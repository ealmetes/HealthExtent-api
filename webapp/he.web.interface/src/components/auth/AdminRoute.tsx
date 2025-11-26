import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useFirebaseAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (!isAdmin) {
    // Redirect to dashboard if not admin
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}
