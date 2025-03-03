import { useState } from "react";
import { randomPasswordGenerator } from "@/lib/helpers/passwordGenerator";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import BottomButtons from "@/common/buttons/BottomButtons";
import { useUpdateUserPassword } from "@/hooks/users.hook";
import { Input } from "@/common/ui/input";

export default function PasswordResetModalBody({ extraObject, closeModal }) {
  const { email: userEmail, id: userId } = extraObject;
  const [email, setEmail] = useState("");
  const newPassword = useState(randomPasswordGenerator())[0];

  const { mutate: passwordResetMutation, isPending } = useUpdateUserPassword(
    closeModal,
    true,
  );

  function inputChangeHandler(e) {
    const value = e.target.value;
    setEmail(value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (email.trim() === "" || !email.includes("@")) {
      ToastNotification("error", "Please enter the correct email");
      return;
    }

    if (email !== userEmail) {
      ToastNotification("error", "Email not match");
      return;
    }

    const passwordDetails = { userId, newPassword };

    passwordResetMutation(passwordDetails);
  }

  return (
    <form onSubmit={handleSubmit} className="py-2 sm:p-4">
      <div>
        <label className="mb-2 block text-base font-thin" htmlFor="email">
          Please enter{" "}
          <span className="font-medium text-gray-100 text-secondary">
            {userEmail}
          </span>{" "}
          to reset owners password
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={inputChangeHandler}
          required
        />

        <label
          className="font-regular mt-2 block text-base"
          htmlFor="random-password"
        >
          New Password:{" "}
          <span className="font-medium tracking-wider text-secondary">
            {newPassword}
          </span>
        </label>
      </div>
      <BottomButtons isLoading={isPending} closeModal={closeModal} />
    </form>
  );
}
