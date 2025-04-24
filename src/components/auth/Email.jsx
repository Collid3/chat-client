import { Mail } from "lucide-react";
import React from "react";

const Email = ({ formData, setFormData }) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Email</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="size-5 text-base-content/40" />
        </div>
        <input
          type="email"
          className={`input input-bordered w-full pl-4`}
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Email;
