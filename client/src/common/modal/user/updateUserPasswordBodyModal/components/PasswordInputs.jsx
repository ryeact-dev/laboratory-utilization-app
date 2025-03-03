import ErrorText from "@/common/typography/ErrorText";

import { PASSWORD_REQUIREMENTS } from "@/globals/initialValues";
import { useState } from "react";
import { useEffect } from "react";

import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInputs({ form }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requirements, setRequirements] = useState(PASSWORD_REQUIREMENTS);

  const {
    formState: { errors },
    setvalue,
    watch,
    register,
  } = form;

  const onToggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prevState) => !prevState);
  };

  const onToggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  const onToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  useEffect(() => {
    setRequirements(
      requirements.map((req) => ({
        ...req,
        met: req.regex.test(watch("newPassword")),
      })),
    );
  }, [watch("newPassword")]);

  // RENDER SECTION
  return (
    <div className="mb-4 flex flex-col gap-2">
      <Label className="font-normal">Current Password</Label>

      <input autoComplete="hidden-password" hidden />

      <div htmlFor="email" className="flex-center relative flex">
        <Input
          {...register("currentPassword")}
          type={showCurrentPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Type your password here"
          className="-mb-2 placeholder:text-xs placeholder:font-thin placeholder:text-gray-300"
        />

        <button
          className="absolute inset-y-0 end-0 top-1 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={onToggleCurrentPasswordVisibility}
          aria-label={showCurrentPassword ? "Hide password" : "Show password"}
          aria-pressed={showCurrentPassword}
          aria-controls="password"
        >
          {showCurrentPassword ? (
            <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
      <ErrorText>
        {errors?.currentPassword ? errors?.currentPassword.message : ""}
      </ErrorText>

      <Label className="mt-2 font-normal">New Password</Label>
      <div htmlFor="email" className="flex-center relative flex">
        <Input
          {...register("newPassword")}
          type={showNewPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Type your new password here"
          className="-mb-2 placeholder:text-xs placeholder:font-thin placeholder:text-gray-300"
        />
        <button
          className="absolute inset-y-0 end-0 top-1 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={onToggleNewPasswordVisibility}
          aria-label={showNewPassword ? "Hide password" : "Show password"}
          aria-pressed={showNewPassword}
          aria-controls="password"
        >
          {showNewPassword ? (
            <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* <PasswordStrength newPassword={values.newPassword} /> */}
      <ul className="mt-1 px-1">
        {requirements.map((req) => (
          <li
            key={req.id}
            className={`text-sm ${req.met ? "text-green-400 line-through" : "font-thin text-gray-100"}`}
          >
            {req.text}
          </li>
        ))}
      </ul>

      <Label className="mt-2 font-normal">Confirm Password</Label>
      <div htmlFor="email" className="flex-center relative flex">
        <Input
          {...register("confirmPassword")}
          type={showCurrentPassword ? "text" : "password"}
          autoComplete="confirm-password"
          placeholder="Confirm your password here"
          className="-mb-2 placeholder:text-xs placeholder:font-thin placeholder:text-gray-300"
        />

        <button
          className="absolute inset-y-0 end-0 top-1 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={onToggleConfirmPasswordVisibility}
          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          aria-pressed={showConfirmPassword}
          aria-controls="password"
        >
          {showConfirmPassword ? (
            <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
      <ErrorText>
        {errors?.confirmPassword ? errors?.confirmPassword.message : ""}
      </ErrorText>
    </div>
  );
}
