import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Logo from "../../components/auth/Logo";
import Email from "../../components/auth/Email";
import Password from "../../components/auth/Password";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { logIn, isLoggingIn } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Invalid email format");
    }
    if (!formData.password) return toast.error("Password is required");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) logIn(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Logo header="Welcome Back" subHeader="Sign in to your account" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Email formData={formData} setFormData={setFormData} />

            <Password formData={formData} setFormData={setFormData} />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your conversations and catch up with your messages."
        }
      />
    </div>
  );
};

export default LoginPage;
