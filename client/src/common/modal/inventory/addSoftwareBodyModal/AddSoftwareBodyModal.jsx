import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useAddSoftware } from "@/hooks/softwares.hook";
import { format } from "date-fns";
import { useState } from "react";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import BottomButtons from "@/common/buttons/BottomButtons";
import { DatePicker } from "@/common/date-picker/DatePicker";

const startingDate = new Date("2015-08-01");
const maxDate = new Date(
  startingDate.getFullYear() + 15,
  startingDate.getMonth(),
  startingDate.getDate(),
);

const formattedDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

function AddSoftwareBodyModal({ closeModal, extraObject }) {
  const {
    laboratory,
    school_year,
    subs_expiration,
    title: softwareTitle,
    id,
  } = extraObject;

  const titleValue = softwareTitle ? softwareTitle : "";
  const expirationDateValue = subs_expiration
    ? new Date(subs_expiration)
    : new Date();

  const [expirationDate, setExpirationDate] = useState(expirationDateValue);
  const [title, setTitle] = useState(titleValue);

  const { mutate: onAddSoftwareMutation, isPending } =
    useAddSoftware(closeModal);

  const onSubmitClick = (evt) => {
    evt.preventDefault();

    if (title.trim() === "") {
      ToastNotification("error", "Please fill in the Title");
      return;
    }

    // CLONE THE DATE SO IT WONT BE MUTATED THE ORIGINAL DATE
    const cloneExpirationDate = new Date(expirationDate.getTime());
    const mutatedExpirationDate = cloneExpirationDate.setDate(
      cloneExpirationDate.getDate() + 1,
    );

    const forAddingData = {
      school_year,
      laboratory,
      title,
      subs_expiration: id ? new Date(mutatedExpirationDate) : expirationDate,
      softwareId: id,
    };

    if (id) {
      onAddSoftwareMutation({ forAddingData, isNew: false });
    } else {
      onAddSoftwareMutation({ forAddingData, isNew: true });
    }
  };

  // RENDER SECTION
  return (
    <form
      onSubmit={(evt) => onSubmitClick(evt)}
      className="min-h-full flex-col items-center md:flex md:h-72"
    >
      <article className="-mt-4 mb-4 flex w-full items-start gap-3">
        <div className="w-full">
          <Label>Expiration Date</Label>
          <DatePicker
            date={expirationDate}
            setDate={(date) => setExpirationDate(date)}
            minDate={startingDate}
            maxDate={maxDate}
            formattedDate={formattedDate}
            className={"w-48"}
            captionLayout="dropdown-buttons"
            fromYear={2010}
            toYear={2030}
          />
        </div>
      </article>
      <article className="w-full">
        <Label>Sofware Name</Label>
        <Input
          placeholder="Type software name here"
          value={softwareTitle ? softwareTitle : ""}
          onChange={(evt) => setTitle(evt.target.value)}
        />
      </article>
      <article className="mt-28 flex w-full justify-end">
        <BottomButtons
          closeModal={closeModal}
          isLoading={isPending}
          isPayload={false}
        />
      </article>
    </form>
  );
}

export default AddSoftwareBodyModal;
