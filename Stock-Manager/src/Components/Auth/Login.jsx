import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../App";
import Fetch from "../utils";

export default function Login() {
  const { setIsAuth, setCurrentUser, setLoaded, setTheme, theme } =
    useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    Fetch(
      `${import.meta.env.VITE_API}/auth/signin`,
      "POST",
      JSON.stringify({ email, password }),
      { "Content-Type": "application/json" }
    ).then((res) => {
      if (res.type == "success") {
        setErrors({});
        localStorage.setItem("jwt", res.data.token);
        setLoading(false);
        setCurrentUser(res.data.currentUser);
        setTheme(res.data.currentUser.theme);
        setIsAuth(true);
        toast.success(res.message, {
          theme: res.data.currentUser.theme,
        });
      } else {
        setErrors({ [res.type]: res.message });
      }
    });
  };
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0.4, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.4, y: -50 }}
      key={"login"}
      transition={{ duration: 0.3 }}
      className="
        relative 
        flex flex-col justify-center items-center
        min-h-screen px-4 md:px-0 bg-light-secondary-200"
    >
      <form
        onSubmit={handleSubmit}
        className="
          flex flex-col gap-3 justify-start items-center
          w-full max-w-[300px] min-h-[250px] px-5 py-3
          bg-light-primary-500
          rounded-md
          shadow-light 
        "
      >
        <div className="font-bold text-2xl text-light-quarternary-500 mb-3">
          Login
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input ${errors.email ? "!border-error" : ""}`}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            name="password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`input ${errors.password ? "!border-error" : ""}`}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="
                submit-btn my-2 w-full
            "
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : null}
          <p className="w-full">Login</p>
        </button>
      </form>
    </motion.div>
  );
}
