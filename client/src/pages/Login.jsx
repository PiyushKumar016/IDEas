import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from '../validation/loginSchema';
import BgDecor from '../shared/BgDecor';
import { loginUser } from '../API/userAPI';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [backendErrors, setBackendErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {checkAuth} = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(data) {
    setBackendErrors("");
    setLoading(true);

    try{
      const response = await loginUser(data);
      console.log(response);
      if (response?.data.success) {
        checkAuth();
        navigate('/Projects');
      } 
      else {
        setBackendErrors(response?.message || "Invalid email or password");
      }
    }
    catch (err) {
      setBackendErrors("Something went wrong. Please try again.");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#faf9ff] font-sans flex items-center justify-center px-4 relative overflow-hidden">
      <BgDecor />
      
      <div className="relative z-10 w-full max-w-sm bg-white border border-[#ede8ff] rounded-3xl shadow-[0_10px_40px_rgba(124,58,237,0.08)] px-6 py-6">
        
        <div className="flex flex-col items-center mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] flex items-center justify-center mb-2.5 shadow-md shadow-[#7c3aed30]">
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
          <h1 className="text-[20px] font-bold text-[#1a1333] tracking-tight">Welcome back</h1>
          <p className="text-[12px] text-[#9d8cc4] mt-0.5">Log in to continue coding on IDEas</p>
        </div>

        {backendErrors && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-[12px]">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{backendErrors}</span>
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#a78bfa]">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Email address"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#ede8ff] bg-[#faf9ff] text-[13px] text-[#1a1333] placeholder-[#c4b5fd] outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed15] transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 pl-1">
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#a78bfa]">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#ede8ff] bg-[#faf9ff] text-[13px] text-[#1a1333] placeholder-[#c4b5fd] outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-[#7c3aed15] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#c4b5fd] hover:text-[#7c3aed] transition-colors"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24L1 1l22 22" />
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 pl-1">
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#7c3aed] text-white text-[13px] font-semibold shadow-lg shadow-[#7c3aed25] hover:bg-[#6d28d9] active:scale-[0.99] transition-all cursor-pointer mt-1 disabled:opacity-60 flex justify-center items-center gap-2"
          >
            {loading ? "Logging in..." : "Log in →"}
          </button>

          <div className="flex items-center gap-3 my-0.5">
            <div className="flex-1 h-px bg-[#ede8ff]" />
            <span className="text-[11px] font-medium text-[#c4b5fd]">or</span>
            <div className="flex-1 h-px bg-[#ede8ff]" />
          </div>

          <p className="text-center text-[12px] text-[#9d8cc4] mt-1">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#7c3aed] font-semibold no-underline hover:underline">
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;