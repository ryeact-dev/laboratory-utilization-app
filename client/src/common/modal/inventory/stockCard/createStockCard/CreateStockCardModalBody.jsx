import {
  INITIAL_STOCK_CARD_OBJ,
  LAB_ITEM_MEASUREMENTS,
  OFFICE_ITEM_MEASUREMENTS,
} from "@/globals/initialValues";
import { useCreateEditStockCard } from "@/hooks/stockCard.hook";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateStockcardInputs from "./components/create-stockcard-inputs/CreateStockcardInputs";
import { stockCardSchema } from "@/schemas/zodSchema";
import BottomButtons from "@/common/buttons/BottomButtons";

const CATEGORY = ["Office", "Consumable", "Reusable"];

export default function CreateStockCardModalBody({ closeModal, extraObject }) {
  const isTemporaryUpdate = true;

  const { mutate: onCreateEditStockCardMutation, isPending } =
    useCreateEditStockCard(closeModal);

  const { isOffice, stockCardData, laboratory, isEdit, submissionDate } =
    extraObject;

  console.log(submissionDate);

  const itemCategory = isOffice ? [...CATEGORY] : [...CATEGORY].slice(1, 3);
  // const laboratory = laboratoryName(currentUser.laboratory[0]);

  const currentLaboratory = isEdit ? stockCardData.laboratory_name : laboratory;

  const [updateLaboratory, setUpdateLaboratory] = useState(currentLaboratory);
  const [laboratoryError, setLaboratoryError] = useState(false);

  const typesOfMeasurements = isOffice
    ? OFFICE_ITEM_MEASUREMENTS
    : LAB_ITEM_MEASUREMENTS;

  const form = useForm({
    resolver: zodResolver(stockCardSchema),
    defaultValues: stockCardData ? stockCardData : INITIAL_STOCK_CARD_OBJ,
  });

  const { setValue } = form;

  const onSubmit = (stockCardDetails) => {
    if (updateLaboratory === "") return setLaboratoryError(true);

    let isNew = true;
    let forAddingData = {
      ...stockCardDetails,
      // item_category: isOffice ? 'Office' : values.item_category,
      laboratory_name: isTemporaryUpdate ? updateLaboratory : laboratory,
      submissionDate,
    };

    if (stockCardData) {
      forAddingData = {
        ...forAddingData,
        id: stockCardData.id,
      };
      isNew = false;
      onCreateEditStockCardMutation({ forAddingData, isNew });
    } else {
      onCreateEditStockCardMutation({ forAddingData, isNew });
    }
  };

  useEffect(() => {
    isOffice && setValue("item_category", "Office");
  }, []);

  return (
    <>
      <h2 className="-mt-2 mb-2 text-lg font-medium">{laboratory}</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <CreateStockcardInputs
          form={form}
          isEdit={isEdit}
          updateLaboratory={updateLaboratory}
          setUpdateLaboratory={setUpdateLaboratory}
          laboratoryError={laboratoryError}
          isOffice={isOffice}
          itemCategory={itemCategory}
          typesOfMeasurements={typesOfMeasurements}
        />

        <BottomButtons
          closeModal={closeModal}
          isLoading={isPending}
          isPayload={false}
        />
      </form>
    </>
  );
}
