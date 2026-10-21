import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen text-[#7c3aed]">
        Loading...
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
export const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen text-[#7c3aed]">
        Loading...
      </div>
    );
  }
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};