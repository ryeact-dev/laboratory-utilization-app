import { Label } from "@/common/ui/label";

export default function OrientationList({ elementId, laboratoryOrientation }) {
  const { lab_safety_guidelines, lab_evac_plan, lab_emergency_drill } =
    laboratoryOrientation || {};

  return (
    <>
      <div className="mt-4 space-y-2">
        <Label className="text-sm">
          Please check if the Instructor conducted the following:
        </Label>
        <div className="flex items-center gap-2">
          <Label className="text-xs">
            [{lab_safety_guidelines ? "\u2713" : "\u2715"}]
          </Label>

          <Label
            htmlFor={elementId}
            className="text-xs font-normal text-foreground"
          >
            Orientation on Laboratory Safety Guidelines
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs">
            [{lab_evac_plan ? "\u2713" : "\u2715"}]
          </Label>

          <Label
            htmlFor={elementId}
            className="text-xs font-normal text-foreground"
          >
            Orientation on Evacuation (Including exit doors and exit to
            Evacuation Area).
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs">
            [{lab_emergency_drill ? "\u2713" : "\u2715"}]
          </Label>

          <Label
            htmlFor={elementId}
            className="text-xs font-normal text-foreground"
          >
            Emergency Drill (Including Duck, Cover and Hold, and orderly exit).
          </Label>
        </div>
      </div>
    </>
  );
}
