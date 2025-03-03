import { Button } from "../ui/button";
import { CircleX, LoaderCircle, Send } from "lucide-react";

export default function BottomButtons({
  closeModal,
  isLoading,
  isPayload = false,
  btnName = "Submit",
  loadingBtnName = "Submitting...",
  cancelBtnName = "Cancel",
}) {
  // if there is a payload on subject
  const btnNameUpdate = isLoading ? "Updating..." : "Update";

  // if there is no a payload on subject
  const btnNameNew = isLoading ? loadingBtnName : btnName;

  return (
    <footer className="mt-6 flex items-center justify-end">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="destructive"
          onClick={() => closeModal()}
        >
          <p className="flex items-center gap-1">
            <CircleX size={18} strokeWidth={2.5} />
            {cancelBtnName}
          </p>
        </Button>

        <Button
          variant="secondary"
          type="submit"
          className={`w-44 px-6 font-semibold normal-case`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle
                className="-ms-1 me-2 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              {loadingBtnName}
            </>
          ) : (
            <p className="flex items-center gap-1">
              <Send size={18} strokeWidth={2.5} />
              {isPayload ? btnNameUpdate : btnNameNew}
            </p>
          )}
        </Button>
      </div>
    </footer>
  );
}
