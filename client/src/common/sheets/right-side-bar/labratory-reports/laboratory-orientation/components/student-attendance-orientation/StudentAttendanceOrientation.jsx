import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { format } from "date-fns";

export default function StudentAttendanceOrientation({
  sliceClasslist,
  dateConducted,
  classlist,
  studentAttendance,
}) {
  const slicedAttendance = studentAttendance?.slice(
    sliceClasslist?.start,
    sliceClasslist?.end,
  );

  const slicedClasslist = classlist?.slice(
    sliceClasslist?.start,
    sliceClasslist?.end,
  );

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className={TABLE_HEADER_BADGE_CLASS}>PCN</TableHead> */}
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Name</TableHead>
            <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-center`}>
              {dateConducted && format(new Date(dateConducted), "MMM dd")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slicedClasslist?.map(({ id_number, full_name }, index) => (
            <TableRow key={index} className="hover items-center">
              {/* <TableHead className="w-10 text-sm font-semibold">
                <h2>
                  {id_number
                    ? `${index < 9 ? `0${index + 1}` : `${index + 1}`}`
                    : "\u00a0"}
                </h2>
              </TableHead> */}
              <TableHead className="text-left text-sm font-normal uppercase">
                <h2 className="">
                  {slicedClasslist[index]?.id_number
                    ? `${sliceClasslist?.start + (index + 1) < 10 ? `0${sliceClasslist?.start + (index + 1)}` : sliceClasslist?.start + (index + 1)}. ${full_name}`
                    : ""}
                </h2>
              </TableHead>

              <TableCell className={`text-center`}>
                <h2
                  className={`mx-auto font-bold ${
                    slicedAttendance[index] === "false" ||
                    !slicedAttendance[index]
                      ? "text-primary"
                      : "text-green-600"
                  }`}
                >
                  {slicedClasslist[index]?.id_number
                    ? slicedAttendance[index] === "false" ||
                      !slicedAttendance[index]
                      ? "x"
                      : "\u2713"
                    : "\u00a0"}
                </h2>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
