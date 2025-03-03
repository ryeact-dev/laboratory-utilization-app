import BottomButtons from "@/common/buttons/BottomButtons";
import MultipleSelector from "@/common/multi-selector/MutliSelector";
import { OFFICE_LIST } from "@/globals/initialValues";
import { useAssignUserOffices } from "@/hooks/users.hook";
import { useState } from "react";

export default function AssignUserOfficeModalBody({ closeModal, extraObject }) {
  const { userInfo, isUserInfo = false } = extraObject;

  const { mutate: addEditUserMutation, isPending } =
    useAssignUserOffices(closeModal);

  const userOffices = userInfo.office
    ? [...userInfo.office].map((item) => {
        return {
          value: item,
          label: item,
        };
      })
    : [{ value: "", label: "" }];

  const [office, setOffice] = useState(userOffices);

  const onSubmitClick = (evt) => {
    evt.preventDefault();

    const offices = [...office].map((lab) => {
      return lab.value;
    });

    const forUpdatingData = {
      userId: userInfo.id,
      office: offices,
    };

    addEditUserMutation(forUpdatingData);
  };

  return (
    <form onSubmit={onSubmitClick}>
      <h1 className="mb-1 px-2 py-1 text-base font-medium">
        Assign Laboratories
      </h1>

      <MultipleSelector
        value={office}
        onChange={setOffice}
        defaultOptions={OFFICE_LIST}
        hidePlaceholderWhenSelected
        placeholder="Select laboratories..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
        className="w-full"
      />

      <BottomButtons
        closeModal={closeModal}
        isLoading={isPending}
        isPayload={false}
      />
    </form>
  );
}
