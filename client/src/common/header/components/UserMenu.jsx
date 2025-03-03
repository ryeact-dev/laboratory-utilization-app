import { modalStore } from "@/store";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/common/ui/dropdown-menu";
import { LockKeyhole, LogOut, RotateCcw, User, Wifi } from "lucide-react";

export default function UserMenu({ currentUser }) {
  const openModal = modalStore((state) => state.openModal);

  const openUpdatePasswordModal = (userId) => {
    const payload = {
      title: "Update Password",
      bodyType: MODAL_BODY_TYPES.USERS_UPDATE_PASSWORD,
      extraObject: userId,
    };

    openModal(payload);
  };

  const openProfileModal = () => {
    const userInfo = {
      id: currentUser.userId,
      email: currentUser.email,
      full_name: currentUser.full_name,
      user_role: currentUser.role,
      photo_url: currentUser.photoURL,
      esign_url: currentUser.esignURL,
      laboratory: currentUser.laboratory,
      user_program: currentUser.program,
      department: currentUser.department,
    };

    const payload = {
      title: "User Profile",
      bodyType: MODAL_BODY_TYPES.USERS_ADD_NEW,
      extraObject: { userInfo, isUserInfo: true },
      size: "max-w-2xl",
    };

    openModal(payload);
  };

  const openWifiVoucherModal = () => {
    const payload = {
      title: "Wifi Vouchers",
      bodyType: MODAL_BODY_TYPES.SET_WIFI_VOUCHER,
      extraObject: { laboratory: currentUser.laboratory },
    };

    openModal(payload);
  };

  const logoutUser = () => {
    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to logout?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGOUT_USER,
      },
    };

    openModal(payload);
  };

  const onPageReloadClick = () => {
    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Reload all client's current pages?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.PAGE_RELOAD,
      },
    };

    openModal(payload);
  };

  const userManu = [
    {
      name: "User Profile",
      icon: <User size={18} />,
      onClick: () => openProfileModal(),
    },
    {
      name: "Change Password",
      icon: <LockKeyhole size={18} />,
      onClick: () => openUpdatePasswordModal(currentUser.userId),
    },
    {
      name: "Wifi Vouchers",
      icon: <Wifi size={18} />,
      onClick: () => openWifiVoucherModal(),
    },
  ];

  return (
    <>
      <DropdownMenuGroup className="px-2">
        <p className="text-left text-base font-medium tracking-wider text-secondary hover:cursor-default">
          {currentUser.fullName}
        </p>
        <p className="text-left text-xs font-medium uppercase text-gray-200/70 hover:cursor-default">
          {currentUser.role}
        </p>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {userManu.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className="hover:!bg-transparent"
            onClick={item.onClick}
          >
            <div className="nav-link after:mt-1">
              <p className="flex items-center gap-2 hover:text-secondary">
                {item.icon}
                {item.name}
              </p>
            </div>
          </DropdownMenuItem>
        ))}

        {currentUser.role === "Admin" && (
          <DropdownMenuItem
            className="hover:!bg-transparent"
            onClick={onPageReloadClick}
          >
            <div className="nav-link after:mt-1">
              <p className="flex items-center gap-2 hover:text-secondary">
                <RotateCcw size={18} /> Reload Page
              </p>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={logoutUser}
        className="w-full font-bold normal-case text-primary hover:!bg-primary hover:font-normal hover:text-white"
      >
        <LogOut size={18} /> Logout
      </DropdownMenuItem>
    </>
  );
}
