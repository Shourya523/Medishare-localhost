import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/slices/authSlice";
import axiosInstance from "../config/axios.config";
import { Mail, Lock, ArrowRight, ShieldCheck, LogIn } from "lucide-react";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/users/login", { email, password });

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        const { id, name, email, role } = response.data.user;
        dispatch(loginAction({ id, name, email, role }));

        setMessage("Login successful!");
        setIsSuccess(true);
        setTimeout(() => navigate("/"), 1000);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      setMessage("Invalid credentials. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12 relative z-10">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Bento Box: Welcome & Branding */}
        <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-emerald-200">
          <div className="relative z-10">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome back.</h1>
            <p className="text-emerald-50/80 text-lg leading-relaxed font-medium">
              Access your personalized health ecosystem and manage your contributions securely.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-emerald-500 bg-emerald-400" />
              ))}
            </div>
            <p className="text-sm font-semibold text-emerald-100">Trusted by 2,000+ medical partners</p>
          </div>

          {/* Decorative background icon */}
          <LogIn className="absolute -bottom-10 -right-10 h-64 w-64 text-white/10 -rotate-12" />
        </div>

        {/* Right Bento Box: Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white shadow-xl flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              isSuccess ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
              <div className={`h-2 w-2 rounded-full ${isSuccess ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
              {message}
            </div>
          )}

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 font-bold hover:underline">
              Join the network
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}