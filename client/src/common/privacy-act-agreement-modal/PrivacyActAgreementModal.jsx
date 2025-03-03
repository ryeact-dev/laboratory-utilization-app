import { useDeclineLogoutUser } from "@/hooks/users.hook";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { CircleCheck, CircleX } from "lucide-react";

export default function PrivacyActAgreementModal() {
  const logoutUserMutation = useDeclineLogoutUser();

  return (
    <AlertDialog defaultOpen>
      {/* <AlertDialogTrigger asChild>
      <Button variant="outline">Alert dialog with icon</Button>
    </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            <p className="mb-2 text-2xl tracking-wide text-secondary">
              CONSENT
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">
            (Pursuant to R.A. No. 10173/Data Privacy Act of 2012).
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mb-4">
          <p className="my-4">
            By continuing to use LUMENS, I hereby give my consent to the
            Laboratory Management Office (LMO) to collect and use my personal
            data in relation to my LUMENS profile and transactions.
          </p>
          <p>
            All information provided herein shall be treated with strict
            confidentiality and shall not be shared without consent with third
            parties other than the proper personnel to whom the information is
            intended.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => logoutUserMutation.mutate()}>
            <CircleX size={18} /> Decline
          </AlertDialogCancel>
          <AlertDialogAction className="w-36">
            <CircleCheck size={18} /> Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
