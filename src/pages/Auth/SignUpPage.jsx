import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Loader2, MessageSquare } from "lucide-react";
import Username from "../../components/auth/Username";
import Email from "../../components/auth/Email";
import Password from "../../components/auth/Password";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";
import toast from "react-hot-toast";
import Logo from "../../components/auth/Logo";

const SignUpPage = () => {
  const { signUp, isSigningUp } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) signUp(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Logo
            header="Create Account"
            subHeader="Get started with your free account"
          />

          {/* Form */}
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <Username formData={formData} setFormData={setFormData} />
            <Email formData={formData} setFormData={setFormData} />
            <Password formData={formData} setFormData={setFormData} />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
