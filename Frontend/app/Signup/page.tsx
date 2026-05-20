// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../Database/supabase-client";

// export default function SignupPage() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSignup(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { full_name: name },
//       },
//     });

//     if (error) {
//       setError(error.message);
//       setLoading(false);
//       return;
//     }

//     router.push("/Login");
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-[url('/Background.png')] bg-cover bg-center">
//       <main className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-4xl shadow-2xl 
//           shadow-gray-400/60 border border-white/60 px-8 py-10 md:px-12 md:py-12 
//           flex flex-col md:flex-row gap-10">

//           {/* Left Section */}
//           <div className="md:w-1/2 flex flex-col justify-center gap-4">
//             <h1 className="text-3xl font-semibold text-gray-800">Create Account</h1>

//             <p className="text-sm text-gray-600 leading-relaxed">
//               Join the{" "}
//               <span className="font-semibold text-blue-600">Exercise Analyzer</span>{" "}
//               to track your workouts, improve form accuracy, and analyze muscles in real time.
//             </p>
//           </div>

//           {/* Right Section – Signup Form */}
//           <div className="md:w-1/2 flex flex-col justify-center">
//             <h2 className="text-xl font-semibold text-gray-800 mb-1">Sign Up</h2>
//             <p className="text-sm text-gray-500 mb-5">Create a new account.</p>

//             <form onSubmit={handleSignup} className="space-y-4">

//               <div>
//                 <label className="text-sm font-medium text-gray-700">Full Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
//                   placeholder="Your name"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
//                   placeholder="you@example.com"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">Password</label>
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
//                   placeholder="Create a password"
//                 />
//               </div>

//               {error && <p className="text-xs text-red-500">{error}</p>}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="mt-3 w-full rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 
//                   shadow-md hover:bg-blue-700 disabled:opacity-60"
//               >
//                 {loading ? "Creating account..." : "Sign Up"}
//               </button>
//             </form>

//             <button
//               onClick={() => router.push("/Login")}
//               className="mt-4 text-xs text-blue-600 hover:underline self-center"
//             >
//               Already have an account? Login
//             </button>

//             <button
//               onClick={() => router.push("/")}
//               className="mt-4 text-xs text-gray-500 hover:text-gray-700 self-center"
//             >
//               ← Back to Home
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
