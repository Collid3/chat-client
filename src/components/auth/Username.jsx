import { User } from "lucide-react";
import React from "react";

const Username = ({ formData, setFormData }) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Full Name</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="size-5 text-base-content/40" />
        </div>
        <input
          type="text"
          className={`input input-bordered w-full pl-4`}
          placeholder="John Doe"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default Username;
