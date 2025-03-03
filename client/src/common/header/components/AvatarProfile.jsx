import Avatar from "@/common/avatar/Avatar";

export default function AvatarProfile({ currentUser, isOnline }) {
  return (
    <div className="flex items-center justify-center">
      <Avatar
        isOnline={isOnline}
        userPhoto={currentUser?.photoURL}
        alt={"profile-photo"}
        className={"h-9 w-9"}
      />
    </div>
  );
}
