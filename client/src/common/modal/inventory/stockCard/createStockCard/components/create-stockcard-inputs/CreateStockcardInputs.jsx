import SelectLaboratory from "@/common/select/SelectLaboratory";
import ErrorText from "@/common/typography/ErrorText";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";
import { useGetCurrentUserData } from "@/hooks/users.hook";

export default function CreateStockcardInputs({
  form,
  isEdit,
  updateLaboratory,
  setUpdateLaboratory,
  laboratoryError,
  isOffice,
  itemCategory,
  typesOfMeasurements,
}) {
  const { currentUser } = useGetCurrentUserData();

  const {
    formState: { errors },
    register,
    setValue,
    watch,
    getValues,
  } = form;

  return (
    <>
      <div className="flex-[2]">
        <Label className="font-normal">Name</Label>
        <Input
          {...register("item_name")}
          placeholder="Item Name.."
          className={"capitalize placeholder:font-thin placeholder:italic"}
        />
        <ErrorText>
          {errors?.item_name ? errors?.item_name.message : ""}
        </ErrorText>
      </div>

      {isEdit && !isOffice && (
        <div>
          <Label className="font-normal">Laboratory</Label>
          <SelectLaboratory
            laboratory={updateLaboratory}
            onLaboratoryChange={(value) => setUpdateLaboratory(value)}
            currentUser={currentUser}
            width={"w-full"}
            isMism={true}
            isEdit={isEdit}
          />
          <ErrorText>
            {laboratoryError && "Please select a laboratory"}
          </ErrorText>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1">
          <Label className="font-normal">Category</Label>
          <Select
            onValueChange={(value) => setValue("item_category", value)}
            defaultValue={watch("item_category")}
            disabled={isOffice}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {/* {wasAcknowledged && <option value="">Select All Laboratories</option>} */}
              {itemCategory.map((item, k) => {
                return (
                  <SelectItem value={item} key={k}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <ErrorText>
            {errors?.item_category ? errors?.item_category.message : ""}
          </ErrorText>
        </div>
        <div className="flex-1">
          <Label className="font-normal">Measurement</Label>

          <Select
            onValueChange={(value) => setValue("item_unit", value)}
            defaultValue={getValues("item_unit")}
            // disabled={isOffice}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Measurement" />
            </SelectTrigger>
            <SelectContent>
              {/* {wasAcknowledged && <option value="">Select All Laboratories</option>} */}
              {typesOfMeasurements.map((item, k) => {
                return (
                  <SelectItem value={item.value} key={k}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <ErrorText>
            {errors?.item_unit ? errors?.item_unit.message : ""}
          </ErrorText>
        </div>
      </div>

      <Label className="font-normal">Remarks</Label>
      <Input
        {...register("remarks")}
        placeholder="Item remarks.."
        className={"placeholder:font-thin placeholder:italic"}
      />
      <ErrorText>{errors?.remarks ? errors?.remarks.message : ""}</ErrorText>
    </>
  );
}
