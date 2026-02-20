import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useUser } from "../../context/UserContext";

axios.defaults.withCredentials = true;

export default function SignInForm() {
  const navigate = useNavigate();
  const { setUserRole } = useUser();

  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          nip: nip,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const { name, role, nip: userNip, rw } = response.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ name, role, nip: userNip, rw })
      );

      setUserRole(role);

      navigate("/dashboard");
    } catch (error: any) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      } else {
        setErrorMsg("Terjadi kesalahan, coba lagi.");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan NIP dan password untuk masuk!
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>
                  NIP <span className="text-error-500">*</span>
                </Label>
                <Input
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Masukkan NIP Anda"
                />
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password Anda"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  className="w-full !bg-[#285303] dark:!bg-[#092635] text-white dark:text-white hover:!bg-[#224502] dark:hover:!bg-[#071d29]"
                  size="sm"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
