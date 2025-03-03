import { useState } from "react";
import { INITIAL_NEW_USER_OBJ } from "@/globals/initialValues";
import { randomPasswordGenerator } from "@/lib/helpers/passwordGenerator";
import { useAddEditUser, useGetCurrentUserData } from "@/hooks/users.hook";
import UserInputs from "./components/user-inputs/UserInputs";
import BottomButtons from "@/common/buttons/BottomButtons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/schemas/zodSchema";

export default function AddUserModalBody({ closeModal, extraObject }) {
  const { currentUser } = useGetCurrentUserData();

  const { userInfo, isUserInfo = false } = extraObject;

  const currentUserRole = currentUser.role;
  const password = useState(randomPasswordGenerator())[0];
  const [userPhoto, setUserPhoto] = useState(userInfo?.photo_url || null);
  const [userEsign, setUserEsign] = useState(userInfo?.esign_url || null);

  const { mutate: addEditUserMutation, isPending } = useAddEditUser(closeModal);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: userInfo ? userInfo : INITIAL_NEW_USER_OBJ,
  });

  const onSubmit = (userData) => {
    let laboratory = isUserInfo ? [...userInfo.laboratory] : [];

    const data = {
      email: userData.email,
      full_name: userData.full_name,
      user_program: userData.user_program,
      department: userData.department,
      user_role: userData.user_role,
      photo_url: userPhoto,
      esign_url: userEsign,
      laboratory,
    };

    const forAddingData = new FormData();

    for (const name in data) {
      forAddingData.append(name, data[name]);
    }

    if (!userInfo) {
      forAddingData.append("password", password);
      addEditUserMutation({ forAddingData, isNew: true });
    } else {
      const current_photo = userInfo ? userInfo.photo_url : null;
      const current_esign = userInfo ? userInfo.esign_url : null;

      forAddingData.append("id", userInfo.id);
      forAddingData.append("current_photo", current_photo);
      forAddingData.append("current_esign", current_esign);

      addEditUserMutation({ forAddingData, isNew: false });
    }
  };

  // RENDER SECTION
  return (
    <form className="relative h-full" onSubmit={form.handleSubmit(onSubmit)}>
      <div className={`${isUserInfo ? "" : "flex w-full"} `}>
        <UserInputs
          form={form}
          userPhoto={userPhoto}
          setUserPhoto={setUserPhoto}
          userEsign={userEsign}
          setUserEsign={setUserEsign}
          currentUserRole={currentUserRole}
          userInfo={userInfo || ""}
          isUserInfo={isUserInfo}
          laboratory={userInfo?.laboratory || []}
        />
      </div>
      <div className="mt-8 flex w-full items-center justify-between">
        <div>
          {!userInfo && (
            <label className="font-thin" htmlFor="random-password">
              Password:{" "}
              <span className="font-medium tracking-wider text-secondary">
                {password}
              </span>
            </label>
          )}
        </div>
        <BottomButtons
          closeModal={closeModal}
          isPending={isPending}
          isPayload={isUserInfo}
        />
      </div>
    </form>
  );
}
