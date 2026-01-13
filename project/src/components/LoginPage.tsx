import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/slices/authSlice"; // Adjust the path as needed
import axiosInstance from "../config/axios.config"; // Adjust the path as needed

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/users/login", { email, password });

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);

        // Extract user details and store in Redux
        const { id, name, email, role } = response.data.user;
        dispatch(loginAction({ id, name, email, role }));

        setMessage("Login successful!");
        setIsSuccess(true);
        navigate("/");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
        {message && (
          <div className={`mt-4 p-4 rounded ${isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
