import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendUrl, setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        role === "Admin" ? "/api/admin/login" : "/api/doctor/login";

      const { data } = await axios.post(backendUrl + endpoint, {
        email,
        password,
      });

      if (data.success) {
        if (role === "Admin") {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          localStorage.setItem("aDoken", data.token);
          setDToken(data.token);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">{role} Login</h2>
          <p className="text-sm text-gray-500">
            Please enter your credentials to continue
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          {role === "Admin" ? (
            <>
              Doctor Login?{" "}
              <span
                onClick={() => setRole("Doctor")}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin Login?{" "}
              <span
                onClick={() => setRole("Admin")}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Click here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
