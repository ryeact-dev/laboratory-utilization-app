import BottomButtons from "@/common/buttons/BottomButtons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { useSubmitManyReports } from "@/hooks/instructorWeeklyUsage.hook";
import { calculateUsageTime } from "@/lib/helpers/dateTime";

export default function SubmissionOfWeeklyUsageModalBody({
  extraObject: forAddingData,
  closeModal,
}) {
  const { mutate: submitManyWeeklyUsageMutation, isPending } =
    useSubmitManyReports(closeModal);

  const onSubmit = (evt) => {
    evt.preventDefault();

    const payload = {
      forAddingData,
      isNew: true,
    };

    submitManyWeeklyUsageMutation(payload);
  };

  return (
    <div className="-mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Title</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Instructor
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Weekly Usage
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Week No.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forAddingData.map(
            (
              { subjectCode, subjectTitle, usageHours, weekNumber, instructor },
              index,
            ) => {
              if (weekNumber > 0)
                return (
                  <TableRow key={index}>
                    <TableCell className="flex-1">{`${subjectCode}-${subjectTitle}`}</TableCell>
                    <TableCell className="flex-1">{instructor}</TableCell>
                    <TableCell className="flex-1">
                      {calculateUsageTime(usageHours)}
                    </TableCell>
                    <TableCell className="flex-1">{weekNumber}</TableCell>
                  </TableRow>
                );
            },
          )}
        </TableBody>
      </Table>
      <form onSubmit={onSubmit}>
        <BottomButtons isLoading={isPending} closeModal={closeModal} />
      </form>
    </div>
  );
}
