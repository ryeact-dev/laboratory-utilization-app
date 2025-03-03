import { INITIAL_VALUES_PASSWORDS } from "@/globals/initialValues";
import BottomButtons from "@/common/buttons/BottomButtons";
import { useUpdateUserPassword } from "@/hooks/users.hook";
import PasswordInputs from "./components/PasswordInputs";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserPasswordSchema } from "@/schemas/zodSchema";

export default function UpdateUserPasswordBodyModal({
  closeModal,
  extraObject,
}) {
  const { mutate: updateAccountPasswordMutation, isPending } =
    useUpdateUserPassword(closeModal, false);

  const form = useForm({
    resolver: zodResolver(updateUserPasswordSchema),
    defaultValues: INITIAL_VALUES_PASSWORDS,
  });

  const onSubmit = (updatedPassword) => {
    const updatedData = {
      ...updatedPassword,
      userId: extraObject,
      isUpdatePassword: true,
    };

    updateAccountPasswordMutation(updatedData);
  };

  // RENDER SECTION
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto mb-2 max-w-screen-lg px-2 sm:w-96 sm:px-0"
    >
      <PasswordInputs form={form} />

      <BottomButtons
        closeModal={closeModal}
        isLoading={isPending}
        isPayload={true}
      />
    </form>
  );
}
