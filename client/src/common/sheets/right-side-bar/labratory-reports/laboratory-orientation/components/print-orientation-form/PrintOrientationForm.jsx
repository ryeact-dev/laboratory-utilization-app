import laboratoryOrientationForm from "@/assets/lab-orientation-form.png";
import { format } from "date-fns";
import StudentAttendance from "./components/student-attendance/StudentAttendance";
import { useState } from "react";

export default function PrintOrientationForm({
  componentToPrintRef,
  laboratoryOrientation,
  students,
  schedule,
}) {
  const [instructorEsignError, setInstructorEsignError] = useState(false);

  const { code, title, sched_start_time, sched_end_time } = schedule || {};

  const {
    date_conducted,
    date_acknowledged,
    instructor,
    instructor_esign,
    custodian,
    custodian_esign,
    term_sem,
    school_year,
    students_attendance,
    lab_safety_guidelines,
    lab_evac_plan,
    lab_emergency_drill,
    program,
  } = laboratoryOrientation || {};

  return (
    <div
      className="forPrint relative -mt-1.5 h-full w-full font-[calibri] uppercase text-black"
      ref={componentToPrintRef}
    >
      {/* Form Data */}
      <div className="absolute left-0 top-0 z-10 w-full">
        {/* Orientation Details */}
        <div className="flex w-full items-center justify-around pt-[145px] text-xs">
          <p className="ml-20">{program}</p>
          <p className="ml-32">{title}</p>
          <p className="mx-12">
            {format(new Date(date_conducted), "MMM dd, yyyy")}
          </p>
          <p className="-ml-8 -mt-2 mr-4 w-16 leading-3 tracking-tight">{`${format(new Date(sched_start_time), "hh:mm a")} - ${format(
            new Date(sched_end_time),
            "hh:mm a",
          )}`}</p>
        </div>

        <div className="mt-3 flex w-full items-center justify-around text-xs">
          <p className="w-full pl-36">{term_sem}</p>
          <p className="min-w-28 pl-2">{school_year}</p>
          <p className="w-full pl-12">{instructor}</p>
          <p></p>
        </div>

        {/* Student Attendance */}
        <div className="ml-1 mt-0.5 flex items-center justify-center">
          <div className="mt-9 flex-1">
            <div className="ml-8 w-[85%] bg-white pb-2 pl-4">
              <StudentAttendance
                start={0}
                end={25}
                students={students}
                attendance={students_attendance}
              />
            </div>
          </div>
          <div className="mt-9 flex-1">
            <div className="ml-1 w-[85%] bg-white pb-2 pl-4">
              <StudentAttendance
                start={25}
                end={50}
                students={students}
                attendance={students_attendance}
              />
            </div>
          </div>
        </div>

        {/* Orientation Checklist */}
        <div className="ml-3 mt-11 pl-28">
          <p className="text-xs font-bold">
            {lab_safety_guidelines ? "✔" : "X"}
          </p>
          <p className="-mt-0.5 text-xs font-bold">
            {lab_evac_plan ? "✔" : "X"}
          </p>
          <p className="text-xs font-bold">
            {lab_emergency_drill ? "✔" : "X"}
          </p>
        </div>

        {/* Conducted and Attested by */}
        <div className="mt-10 flex items-center justify-center">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="h-10">
              {!instructorEsignError ? (
                <img
                  src={import.meta.env.VITE_LOCAL_BASE_URL + instructor_esign}
                  alt="lab-orientation-instructor-esign"
                  className="h-10 w-full object-contain object-center"
                  onError={() => setInstructorEsignError(true)}
                />
              ) : (
                <p className="pt-2 text-sm text-gray-700">No Esignature</p>
              )}
            </div>

            <p className="-mt-4">{instructor}</p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="h-10">
              {date_acknowledged && (
                <img
                  src={import.meta.env.VITE_LOCAL_BASE_URL + custodian_esign}
                  alt="lab-orientation-custodian-esign"
                  className="h-10 w-full object-contain object-center"
                />
              )}
            </div>

            <p className="-mt-4">{custodian}</p>
          </div>
        </div>
      </div>

      {/* Form Page as background */}
      <div className="-z-10 -mt-8">
        <img
          src={laboratoryOrientationForm}
          alt="laboratoryOrientationForm"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}
