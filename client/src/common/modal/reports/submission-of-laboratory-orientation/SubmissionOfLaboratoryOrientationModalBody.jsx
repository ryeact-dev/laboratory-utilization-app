import { Label } from "@/common/ui/label";
import ListOfOrientationTable from "./components/list-of-orientation-table/ListOfOrientationTable";
import OrientationChecklist from "./components/orientation-checklist/OrientationChecklist";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orientationSchema } from "@/schemas/zodSchema";
import { INITIAL_ORIENTATION_SUBMISSION_OBJ } from "@/globals/initialValues";
import BottomButtons from "@/common/buttons/BottomButtons";
import { useUpdateMultipleLaboratoryOrientations } from "@/hooks/laboratoryOrientation.hook";

export default function SubmissionOfLaboratoryOrientationModalBody({
  extraObject: { orientationData, isForAcknowledgement },
  closeModal,
}) {
  const {
    mutate: acknowledgeMultipleOrientationsMutation,
    isPending: isPendingMultiple,
  } = useUpdateMultipleLaboratoryOrientations(closeModal);

  const {
    mutate: acknowledgeSingleOrientationMutation,
    isPending: isPendingSingle,
  } = useUpdateMultipleLaboratoryOrientations(closeModal);

  const form = useForm({
    resolver: zodResolver(orientationSchema),
    defaultValues: !isForAcknowledgement
      ? orientationData[0]
      : INITIAL_ORIENTATION_SUBMISSION_OBJ,
  });

  const onSubmit = (dataToSubmit) => {
    const orientationsId = orientationData.map((orientation) => orientation.id);

    const forUpdatingData = {
      orientationsId,
      lab_safety_guidelines: dataToSubmit.lab_safety_guidelines,
      lab_evac_plan: dataToSubmit.lab_evac_plan,
      lab_emergency_drill: dataToSubmit.lab_emergency_drill,
      status: 1,
    };

    if (isForAcknowledgement) {
      acknowledgeMultipleOrientationsMutation({ forUpdatingData });
    } else {
      acknowledgeSingleOrientationMutation({ forUpdatingData });
    }
  };

  return (
    <form className="-mt-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <Label className="text-base">
          List of orientations to be acknowledged
        </Label>
        <ListOfOrientationTable orientationData={orientationData} />
      </div>
      <OrientationChecklist orientationData={orientationData} form={form} />
      <div>
        <BottomButtons
          closeModal={closeModal}
          isLoading={isForAcknowledgement ? isPendingMultiple : isPendingSingle}
        />
      </div>
    </form>
  );
}
