import { useState, lazy } from "react";

import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import lumensDarkModeURL from "@/assets/lumens_final.png";
import { useLoginUser } from "@/hooks/users.hook";
import ReCAPTCHA from "react-google-recaptcha";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import { Button } from "@/common/ui/button";
import { Separator } from "@/common/ui/separator";
import { Eye, EyeOff, LoaderCircle, Send } from "lucide-react";

const OAuth = lazy(() => import("@/common/auth/OAuth"));

export default function Login() {
  const [recaptcha, setRecaptcha] = useState(false);

  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);

  const { mutate: loginUserMutation, isPending } = useLoginUser(false);

  const onSubmitForm = (evt) => {
    evt.preventDefault();

    if (!recaptcha) {
      return ToastNotification(
        "error",
        "Please verify that you are not a robot",
      );
    }

    if (email.trim() === "" || !email.includes("@")) {
      ToastNotification("error", "Please enter a correct email");
      setError(true);
      return;
    }

    if (password.trim() === "") {
      ToastNotification("error", "Please enter a password");
      setError(true);
      return;
    }

    const forLoginData = { email, password };
    loginUserMutation(forLoginData);
  };

  const onEmailChange = (evt) => {
    const value = evt.target.value;
    setError(false);
    setEmail(value);
  };

  const onPasswordChange = (evt) => {
    const value = evt.target.value;
    setError(false);
    setPassword(value);
  };

  // RENDER SECTION
  return (
    <main className="mx-auto flex min-h-screen flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-neutral-800 to-background px-4 sm:px-0">
      {/* Main Container */}
      <figure className="w-72">
        <img src={lumensDarkModeURL} alt="lumens-login-logo" />
      </figure>
      <section className="min-h-400 relative h-[30rem] w-full max-w-[350px] overflow-hidden rounded-2xl border-2 border-neutral-700 shadow-xl backdrop-blur-xl">
        <form
          onSubmit={onSubmitForm}
          className="flex h-full flex-col items-center justify-center px-6"
        >
          <div className="-mt-6 mb-4 text-center">
            <h1 className="text-2xl font-medium">Welcome Back!👏</h1>
            <h1 className="text-sm tracking-wider text-gray-100">
              Please enter you details
            </h1>
          </div>
          <div className="mb-2 w-full">
            <Label className={` ${error ? "text-secondary" : ""}`}>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Type your email here"
              value={email ? email.toLowerCase() : ""}
              onChange={onEmailChange}
              className={"mb-2 text-sm placeholder:text-xs"}
            />

            <Label className={` ${error ? "text-secondary" : ""}`}>
              Password
            </Label>
            <div htmlFor="email" className="flex-center relative flex">
              <Input
                type={viewPassword ? "text" : "password"}
                name="password"
                autoComplete="user-password"
                placeholder="Type your password here"
                className={"text-sm placeholder:text-xs"}
                onChange={onPasswordChange}
              />
              {!viewPassword ? (
                <EyeOff
                  size={20}
                  className="text-grey-700 absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 transform cursor-pointer"
                  onClick={() => setViewPassword(!viewPassword)}
                />
              ) : (
                <Eye
                  size={20}
                  className="text-grey-700 absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 transform cursor-pointer"
                  onClick={() => setViewPassword(!viewPassword)}
                />
              )}
            </div>

            <div className="mt-4">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setRecaptcha}
              />
            </div>
          </div>

          <Button className="mt-4 w-full" type="submit" variant="secondary">
            <p className="flex items-center gap-1">
              {isPending ? (
                <>
                  <LoaderCircle
                    className="-ms-1 me-2 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Submitting
                </>
              ) : (
                <>
                  <Send size={16} strokeWidth={2.5} />
                  Submit
                </>
              )}
            </p>
          </Button>
          <div className="-mb-3 w-full">
            <Separator className="my-4" />
            <OAuth />
          </div>
        </form>
      </section>
    </main>
  );
}
