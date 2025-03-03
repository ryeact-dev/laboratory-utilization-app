import BottomButtons from "@/common/buttons/BottomButtons";
import MultipleSelector from "@/common/multi-selector/MutliSelector";
import { LABORATORIES_LIST } from "@/globals/initialValues";
import { useAssignUserLaboratories } from "@/hooks/users.hook";
import { useState } from "react";

export default function AssignUserLaboratoriesModlBody({
  closeModal,
  extraObject,
}) {
  const { userInfo, isUserInfo = false } = extraObject;

  const { mutate: addEditUserMutation, isPending } =
    useAssignUserLaboratories(closeModal);

  const userLaboratory = [...userInfo.laboratory].map((lab) => {
    return {
      value: lab,
      label: lab,
    };
  });

  const laboratoryList = [...LABORATORIES_LIST].map((lab) => {
    return {
      value: lab,
      label: lab,
    };
  });

  const [laboratory, setLaboratory] = useState(userLaboratory);

  const onSubmitClick = (evt) => {
    evt.preventDefault();

    const laboratories = [...laboratory].map((lab) => {
      return lab.value;
    });

    const forUpdatingData = {
      userId: userInfo.id,
      laboratory: laboratories,
    };

    addEditUserMutation(forUpdatingData);
  };

  return (
    <form onSubmit={onSubmitClick}>
      <h1 className="mb-1 px-2 py-1 text-base font-medium">
        Assign Laboratories
      </h1>

      <MultipleSelector
        value={laboratory}
        onChange={setLaboratory}
        defaultOptions={laboratoryList}
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
