import { useState } from "react";
import BorrowerListOfSubjects from "./components/borrowerListOfSubjects/BorrowerListOfSubjects";
import { getProgramHeads } from "@/lib/helpers/programHeads";
import BorrowerSearchStudent from "./components/borrowerSearchStudent/BorrowerSearchStudent";
import { addMonths, format } from "date-fns";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import { Badge } from "@/common/ui/badge";
import ErrorText from "@/common/typography/ErrorText";
import { DatePicker } from "@/common/date-picker/DatePicker";
import { Eye, EyeOff } from "lucide-react";

const formattedDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export default function BorrowerLabInput({ form, laboratory, payload }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors, touched },
  } = form;

  const [seePassword, setSeePassword] = useState(false);
  const [fetchedSubject, setFetchedSubject] = useState(payload);
  const [fetchedStudent, setFetchedStudent] = useState(payload);

  const onSeePassword = (passwordOption) => {
    setSeePassword(passwordOption);
  };

  return (
    <>
      <div className="border-grey-400 mt-4 space-y-3 rounded-lg border-2 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-3">
            <BorrowerListOfSubjects
              form={form}
              laboratory={laboratory}
              setFetchedSubject={setFetchedSubject}
              fetchedSubject={fetchedSubject}
            />
            <div className="h-28 rounded-lg border-2 border-accent bg-accent/20 p-2 text-sm">
              <Badge className="mb-2 rounded-md px-4 text-xs">
                Subject Details
              </Badge>
              <div className="">
                <p>
                  Subject:{" "}
                  {fetchedSubject?.code &&
                    `${fetchedSubject.code || ""} - ${
                      fetchedSubject.title || ""
                    }`}
                </p>
                <p>Instructor: {`${fetchedSubject?.instructor || ""}`}</p>
              </div>
              <p>
                Course:{" "}
                {`${
                  getProgramHeads(fetchedSubject?.program, "e").course || ""
                }`}{" "}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <BorrowerSearchStudent
              form={form}
              setFetchedStudent={setFetchedStudent}
              fetchedStudent={fetchedStudent}
            />
            <div className="h-28 rounded-lg border-2 border-accent bg-accent/20 p-2 text-sm">
              <Badge className="mb-2 rounded-md px-4 text-xs">
                Borrower Details
              </Badge>
              <div className="">
                <p>
                  ID Number:{" "}
                  {fetchedStudent?.id && `${fetchedStudent.id_number || ""}`}
                </p>
                <p>Full Name: {`${fetchedStudent?.full_name || ""}`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Label>Date of Use</Label>
            <DatePicker
              date={new Date(watch("schedule_date_of_use")) || new Date()}
              setDate={(date) =>
                setValue("schedule_date_of_use", new Date(date))
              }
              minDate={new Date("2010-08-01")}
              maxDate={addMonths(new Date(), 5)}
              formattedDate={formattedDate}
              className={"w-44"}
            />
            <ErrorText>
              {errors?.schedule_date_of_use && touched?.schedule_date_of_use
                ? errors?.schedule_date_of_use.message
                : ""}
            </ErrorText>
          </div>
          <div className="flex flex-[2] flex-col gap-2">
            <Label>Department/Office</Label>
            <Input
              {...register("college_office")}
              placeholder="Type your college office here..."
              className={"text-sm placeholder:text-xs"}
            />
            <ErrorText>
              {errors?.college_office && touched?.college_office
                ? errors?.college_office.message
                : ""}
            </ErrorText>
          </div>
        </div>
      </div>
      <div className="border-grey-400 mt-4 space-y-3 rounded-lg border-2 p-4 pt-2">
        <div className="flex-[2]">
          <Label>Instructor Password</Label>
          <div className="border-grey-400 relative rounded-lg border">
            {seePassword ? (
              <Eye
                onClick={() => onSeePassword(false)}
                className="absolute right-3 top-2 size-6 cursor-pointer"
              />
            ) : (
              <EyeOff
                onClick={() => onSeePassword(true)}
                className="absolute right-3 top-2 size-6 cursor-pointer"
              />
            )}
            <Input
              {...register("instructor_password")}
              type={seePassword ? "text" : "password"}
              className={
                "input input-sm placeholder:text-grey-700 h-10 w-full text-base placeholder:text-sm"
              }
              autoComplete="instructor_password"
            />
          </div>
          <ErrorText>
            {errors?.instructor_password && touched?.instructor_password
              ? errors?.instructor_password.message
              : ""}
          </ErrorText>
        </div>
      </div>
    </>
  );
}
