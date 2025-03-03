import { DEPARTMENT, PROGRAM, USER_ROLE } from "@/globals/initialValues";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card";
import ErrorText from "@/common/typography/ErrorText";
import AddUserPhoto from "../add-user-photo/AddUserPhoto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";
import SelectItems from "@/common/select/SelectIems";

const USER_NEED_PROGRAM_DERPARTMENT = [
  "Program Head",
  "Faculty",
  "Dean",
  "Custodian",
  "Admin",
];

export default function UserInputs({
  form,
  laboratory,
  currentUserRole,
  userPhoto,
  setUserPhoto,
  userEsign,
  setUserEsign,
  isUserInfo,
}) {
  const {
    formState: { errors },
    getValues,
    setValue,
    register,
    watch,
  } = form;

  const userRole = getValues("user_role");
  const isRoleWithoutLabRestriction =
    userRole !== "Admin" && userRole !== "Dean" && userRole.trim();

  const userAssignedLaboratory = [...laboratory].map((lab) => lab).join(", ");

  const assignedLaboratories = (
    <div>
      <h1 className="mt-3 bg-secondary px-2 font-semibold text-secondary-foreground">
        Assigned Laboratories
      </h1>
      <p className="px-2 py-1 text-sm">{userAssignedLaboratory}</p>
    </div>
  );

  // RENDER SECTION
  return (
    <div className="flex w-full items-start gap-2">
      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex justify-center gap-4">
          <AddUserPhoto
            userPhoto={userPhoto}
            setUserPhoto={setUserPhoto}
            isPhoto={true}
          />
          <AddUserPhoto userPhoto={userEsign} setUserPhoto={setUserEsign} />
        </div>
        <div className="mt-1">
          <Label className="font-normal">Email</Label>
          <Input {...register("email")} placeholder="Email" type="email" />
          <ErrorText>{errors?.email ? errors?.email.message : ""}</ErrorText>

          <Label className="font-normal">Full Name</Label>
          <Input {...register("full_name")} placeholder="Full name" />
          <ErrorText>
            {errors?.full_name ? errors?.full_name.message : ""}
          </ErrorText>
        </div>
      </div>

      <Card className="flex-[2] rounded-md bg-background p-4">
        <CardHeader className="p-0">
          <CardTitle className="mb-4 mt-3.5">Addtional Details</CardTitle>
        </CardHeader>
        <CardContent className="!w-[18rem] p-0">
          <div className="flex flex-1 flex-col">
            <Label className="mb-1 font-normal">Role</Label>
            {currentUserRole === "Admin" ? (
              <>
                <Select
                  value={watch("user_role")}
                  onValueChange={(value) => setValue("user_role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLE.map((role, k) => {
                      return (
                        <SelectItem value={role} key={k}>
                          {role}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <ErrorText>
                  {errors?.user_role ? errors?.user_role.message : ""}
                </ErrorText>
              </>
            ) : (
              <Label className="mb-2 mt-1 dark:text-white">
                {getValues("user_role")}
              </Label>
            )}
          </div>

          {USER_NEED_PROGRAM_DERPARTMENT.includes(currentUserRole) && (
            <div className="flex flex-1 flex-col">
              <Label className="mb-1 font-normal">Program</Label>
              {currentUserRole === "Admin" ? (
                <>
                  <SelectItems
                    value={watch("user_program")}
                    onValueChange={(value) => setValue("user_program", value)}
                    placeholder="Select Program"
                    dataArray={PROGRAM}
                    disabled={watch("user_role") !== "Program Head"}
                    placeholderWidth={"w-full"}
                  />

                  <ErrorText>
                    {errors?.user_program ? errors?.user_program.message : ""}
                  </ErrorText>
                </>
              ) : (
                <Label className="mb-2 mt-1 dark:text-white">
                  {getValues("user_program") || "-"}
                </Label>
              )}
            </div>
          )}

          {USER_NEED_PROGRAM_DERPARTMENT.includes(currentUserRole) && (
            <div className="flex flex-1 flex-col">
              <Label className="mb-1 font-normal">Department</Label>
              {currentUserRole === "Admin" ? (
                <>
                  <Select
                    value={watch("department")}
                    onValueChange={(value) => setValue("department", value)}
                    disabled={
                      !USER_NEED_PROGRAM_DERPARTMENT.slice(0, 4).includes(
                        getValues("user_role"),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENT.map((dept, k) => {
                        return (
                          <SelectItem value={dept} key={k}>
                            {dept}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <ErrorText>
                    {errors?.department ? errors?.department.message : ""}
                  </ErrorText>
                </>
              ) : (
                <Label className="mb-2 mt-1 dark:text-white">
                  {getValues("department") || "-"}
                </Label>
              )}
            </div>
          )}
        </CardContent>

        {/* ASSIGNED LABORATORIES */}
        {currentUserRole !== "Admin" && isUserInfo && assignedLaboratories}
      </Card>
    </div>
  );
}
