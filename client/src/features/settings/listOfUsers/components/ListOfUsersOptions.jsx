import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import {
  Building2,
  DoorOpen,
  Ellipsis,
  Settings2,
  SquarePen,
  Trash,
} from "lucide-react";

export default function ListOfUsersOptions({
  userData,
  currentUser,
  userId,
  openModal,
}) {
  // Assign user laboratories
  const onAssignUserLaboratories = (userInfo) => {
    const payload = {
      title: "Update User Laboratories",
      bodyType: MODAL_BODY_TYPES.USER_ASSIGN_LABORATORIES,
      extraObject: { userInfo, isAccountUpdate: false },
      size: "max-w-lg",
    };

    openModal(payload);
  };

  // Assign user offices
  const onAssignUserOffices = (userInfo) => {
    const payload = {
      title: "Update User Offices",
      bodyType: MODAL_BODY_TYPES.USER_ASSIGN_OFFICES,
      extraObject: { userInfo, isAccountUpdate: false },
      size: "max-w-lg",
    };

    openModal(payload);
  };

  // Update user's password
  const onResetUserPassword = (userData) => {
    const payload = {
      title: "Update user password",
      bodyType: MODAL_BODY_TYPES.USERS_RESET_PASSWORD,
      extraObject: userData,
    };

    openModal(payload);
  };

  // Edit user
  const onEditUser = (userInfo) => {
    const payload = {
      title: "Update User Info",
      bodyType: MODAL_BODY_TYPES.USERS_ADD_NEW,
      extraObject: { userInfo, isAccountUpdate: false },
      size: "max-w-2xl",
    };

    openModal(payload);
  };

  const onDeleteUser = (user) => {
    const message = `Remove ${user.full_name} from user's list?`;

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.USERS_DELETE,
        userId: user.id,
      },
    };

    openModal(payload);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditUser(userData)}>
          <SquarePen />
          Update
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={userData.user_role === "Admin"}
          onClick={() => onAssignUserOffices(userData)}
        >
          <Building2 />
          Offices
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={userData.user_role === "Admin"}
          onClick={() => onAssignUserLaboratories(userData)}
        >
          <DoorOpen />
          Laboratories
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onResetUserPassword(userData)}>
          <Settings2 />
          Reset Password
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={currentUser.userId === userId}
          onClick={() => onDeleteUser(userData)}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
