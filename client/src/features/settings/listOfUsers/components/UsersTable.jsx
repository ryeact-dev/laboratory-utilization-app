import Avatar from "@/common/avatar/Avatar";
import { Button } from "@/common/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import ListOfUsersOptions from "./ListOfUsersOptions";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { useGetSocketData } from "@/lib/helpers/socketIo";

export default function UsersTable({
  onUpdateUserStatus,
  paginatedUsers,
  isPlaceholderData,
  openModal,
}) {
  const { currentUser } = useGetCurrentUserData();

  const listOfUsers = paginatedUsers?.users;

  const { data: onlineUsers } = useGetSocketData("online-users");

  const isOnline = (userId) => {
    const userIsOnline = onlineUsers?.some(
      (onlineUser) => onlineUser.userId === userId,
    );
    return userIsOnline;
  };

  // RENDER SECTION
  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>User</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Designation
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Laboratories
            </TableHead>

            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Status</TableHead>

            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listOfUsers
            .sort((a, b) => a.user_role.localeCompare(b.user_role))
            .map(
              (
                {
                  id,
                  email,
                  full_name,
                  user_role,
                  laboratory,
                  department,
                  photo_url,
                  is_active,
                  office,
                },
                index,
              ) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        isOnline={isOnline(id)}
                        userPhoto={photo_url}
                        className="h-8 w-8"
                      />
                      <div>
                        <p className="font-semibold tracking-wider text-secondary">
                          {full_name}
                        </p>
                        <p className="text-xs text-gray-400">{email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="text-secondary">{user_role}</p>
                    <p className="text-xs text-gray-400">{department}</p>
                  </TableCell>

                  <TableCell>
                    <div className="whitespace-pre text-xs text-gray-300">
                      {laboratory.length > 0
                        ? laboratory.sort().join("\n")
                        : "No laboratory assigned"}
                    </div>
                    <div className="whitespace-pre text-xs text-gray-300">
                      {office?.length > 0 ? office.sort().join("\n") : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    {currentUser.userId !== id && (
                      <Button
                        className={`h-4 w-20 rounded-full px-4 text-[10px] shadow-none ${is_active ? "bg-green-600/20 text-green-500 hover:bg-green-600/10" : "bg-gray-200/10 font-normal text-gray-300 hover:bg-gray-300/20"}`}
                        onClick={() => onUpdateUserStatus(is_active, id)}
                      >
                        {is_active ? "Active" : "Inactive"}
                      </Button>
                    )}
                  </TableCell>

                  <TableCell>
                    <ListOfUsersOptions
                      openModal={openModal}
                      userData={listOfUsers[index]}
                      currentUser={currentUser}
                      userId={id}
                    />
                  </TableCell>
                </TableRow>
              ),
            )}
        </TableBody>
      </Table>

      {isPlaceholderData || paginatedUsers?.hasMore ? (
        <p className="mt-2 text-center">***Nothing Follows***</p>
      ) : null}
    </div>
  );
}
