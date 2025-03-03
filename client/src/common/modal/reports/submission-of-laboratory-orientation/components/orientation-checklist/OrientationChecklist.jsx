import { Checkbox } from "@/common/ui/checkbox";
import { Label } from "@/common/ui/label";

export default function OrientationChecklist({ form }) {
  const { setValue, watch } = form;

  const { lab_safety_guidelines, lab_evac_plan, lab_emergency_drill } = watch();

  const onCheckedChangeHandler = (field, value) => {
    setValue(field, !value);
  };

  return (
    <div className="mt-2 space-y-2 rounded-lg border p-4">
      <Label className="text-sm">
        Please check if the Instructor conducted the following:
      </Label>
      <div className="flex items-center gap-2">
        <Checkbox
          className={
            "border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
          }
          id={"lab_safety_guidelines"}
          checked={lab_safety_guidelines}
          onCheckedChange={() =>
            onCheckedChangeHandler(
              "lab_safety_guidelines",
              lab_safety_guidelines,
            )
          }
        />

        <Label
          htmlFor={"lab_safety_guidelines"}
          className="text-sm font-normal text-foreground"
        >
          Orientation on Laboratory Safety Guidelines
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          className={
            "border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
          }
          id={"lab_evac_plan"}
          checked={lab_evac_plan}
          onCheckedChange={() =>
            onCheckedChangeHandler("lab_evac_plan", lab_evac_plan)
          }
        />

        <Label
          htmlFor={"lab_evac_plan"}
          className="text-sm font-normal text-foreground"
        >
          Orientation on Evacuation (Including exit doors and exit to Evacuation
          Area).
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          className={
            "border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
          }
          id={"lab_emergency_drill"}
          checked={lab_emergency_drill}
          onCheckedChange={() =>
            onCheckedChangeHandler("lab_emergency_drill", lab_emergency_drill)
          }
        />

        <Label
          htmlFor={"lab_emergency_drill"}
          className="text-sm font-normal text-foreground"
        >
          Emergency Drill (Including Duck, Cover and Hold, and orderly exit).
        </Label>
      </div>
    </div>
  );
}
