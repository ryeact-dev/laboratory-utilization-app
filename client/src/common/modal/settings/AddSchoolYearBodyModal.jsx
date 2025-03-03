import { useState } from "react";
import z from "zod";
import ErrorText from "@/common/typography/ErrorText";
import { useAddSchoolYear } from "@/hooks/termSemSchoolYear.hook";
import { Button } from "@/common/ui/button";
import { CircleX, LoaderCircle, Send } from "lucide-react";
import { Input } from "@/common/ui/input";

const formatChecker = (schoolYear) => {
  const schema = z.object({
    schoolYear: z
      .string()
      .regex(
        /^\d{4}-\d{2}$/,
        "School year must be in format YYYY-YY (e.g., 2023-24)",
      )
      .min(1, "School year is required"),
  });

  const result = schema.safeParse({ schoolYear });
  return {
    isValid: result.success,
    error: result.success ? null : result.error.issues[0].message,
  };
};

function AddSchoolYearBodyModal({ closeModal }) {
  const [schoolYear, setSchoolYear] = useState("");
  const [formatError, setFormatError] = useState("");

  const { mutate: addSchoolYearMutation, isPending } =
    useAddSchoolYear(closeModal);

  const onInputChange = (evt) => {
    const value = evt.target.value;
    setSchoolYear(value);
    setFormatError("");
  };

  const onSubmitHandler = async (evt) => {
    evt.preventDefault();
    const { isValid, error } = formatChecker(schoolYear);
    if (!isValid) {
      setFormatError(error);
      return;
    }

    const forAddingData = { schoolYear };
    addSchoolYearMutation(forAddingData);
  };

  return (
    <form onSubmit={(evt) => onSubmitHandler(evt)} className="-mt-3">
      <div className="flex flex-col items-center justify-start">
        <h2 className="text-lg font-semibold">
          Enter a School-Year{" "}
          <span className="text-secondary">(format: 2023-24)</span>
        </h2>
        <Input
          type="text"
          placeholder="Type here"
          className="w-full max-w-sm text-lg font-medium placeholder:text-xs placeholder:italic"
          onChange={onInputChange}
        />
      </div>
      <ErrorText styleClass="text-center mt-2">{formatError}</ErrorText>
      <div className="mt-4 flex items-center justify-end space-x-2">
        <Button variant="destructive" onClick={() => closeModal()}>
          <p className="flex items-center gap-1">
            <CircleX size={18} strokeWidth={2.5} />
            Cancel
          </p>
        </Button>

        <Button
          variant="secondary"
          className="w-40"
          type="submit"
          disabled={isPending}
        >
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
            <span className="flex items-center gap-1">
              <Send size={18} strokeWidth={2} />
              Submit
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddSchoolYearBodyModal;
