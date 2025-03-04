import ErrorText from "@/common/typography/ErrorText";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { getSingleSubject } from "@/api/subjects.api";
import { Label } from "@/common/ui/label";
import SearchInput from "@/common/inputs/SearchInput";

import { CircleUserRound, Clock, SquareMenu } from "lucide-react";
import { format } from "date-fns";

export default function SearchSubjectInput({
  form,
  setFetchedSubject,
  fetchedSubject,
  selectedTermAndSem,
  activeSchoolYear,
}) {
  const fetchSubject = async (subjectCode) => {
    if (!subjectCode) {
      ToastNotification("error", "Please input a subject code");
      return;
    }

    const { data } = await getSingleSubject({
      subjectId: undefined,
      subjectCode,
      activeSchoolYear,
    });

    if (data.length === 0) {
      ToastNotification("error", "Code not found");
      setFetchedSubject(null);
      return;
    }

    const result = data.filter((item) => item.term_sem === selectedTermAndSem);

    if (result.length === 0) {
      ToastNotification(
        "error",
        "Selected subject is not avaiblable scheduler term settings",
      );
      return;
    }

    setFetchedSubject(result[0]);
  };

  const {
    register,
    getValues,
    formState: { errors },
  } = form;

  // RENDER SECTION
  return (
    <>
      <article className="mb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="mt-1 flex-1">
            <Label className="font-normal">Search Subject</Label>
            <SearchInput
              field="code"
              register={register}
              placeholder="Search code"
              className={`h-9 border-none pl-4 focus:outline-none`}
              maxLength={6}
              onClickSearch={() => fetchSubject(getValues("code"))}
            />
          </div>
        </div>
        <ErrorText>{errors?.code ? errors?.code.message : ""}</ErrorText>
      </article>
      <article className="-mt-2">
        <Label className="font-normal">Subject Information</Label>
        <article
          className={`w-full rounded-lg border-2 border-accent bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-accent/70 to-accent/60 px-4 py-1 text-base font-medium text-white`}
        >
          <div className="flex items-center gap-2">
            <SquareMenu size={18} strokeWidth={2} />
            <p className="uppercase">
              {fetchedSubject ? fetchedSubject.title.toUpperCase() : "No info"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} strokeWidth={2} />
            <p className="uppercase">
              {fetchedSubject
                ? format(
                    new Date(`2023-10-10T${fetchedSubject?.start_time}`),
                    "hh:mm a",
                  ) +
                  " to " +
                  format(
                    new Date(`2023-10-10T${fetchedSubject?.end_time}`),
                    "hh:mm a",
                  )
                : "No info"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CircleUserRound size={18} strokeWidth={2} />
            <p className="uppercase">
              {fetchedSubject ? fetchedSubject.instructor : "No info"}
            </p>
          </div>
        </article>
      </article>
    </>
  );
}
