import axios from "axios";
import Button from "../ui/button/Button";

axios.defaults.baseURL = "http://localhost:5000";

export default function SignOut() {
  const handleLogout = async () => {
    try {
      await axios.delete("/logout", { withCredentials: true });
      window.location.href = "/signIn";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      className="!bg-[#1B4242] !text-[#9EC8B9]"
      size="sm"
    >
      Sign Out
    </Button>
  );
}
