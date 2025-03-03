import { modalStore } from "@/store";
import TitleCard from "@/common/titleCard/TitleCard";
import TopSideButtons from "@/common/buttons/TopSideButtons";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import UsersTable from "./components/UsersTable";
import { useSearchParams } from "react-router-dom";
import { useGetPaginatedUsers } from "@/hooks/users.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";

import { Button } from "@/common/ui/button";

import SearchDebounceInput from "@/common/inputs/SearchDebounceInput";
import { CirclePlus } from "lucide-react";

export default function ListOfUsers() {
  const openModal = modalStore((state) => state.openModal);

  const [searchParams, setSearchParams] = useSearchParams({
    username: "",
    page: "1",
  });
  const username = searchParams.get("username");
  const page = searchParams.get("page") || 1;

  const onSearchValueChange = (value) => {
    setSearchParams((prev) => {
      prev.set("username", value);
      prev.set("page", 1);
      return prev;
    });
  };

  // Update User Status
  const onUpdateUserStatus = (is_active, id) => {
    const message = is_active ? "Deactivate User?" : "Activate User?";

    const forUpdatingData = { is_active, id };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.UPDATE_USER_STATUS,
        forUpdatingData,
      },
    };

    openModal(payload);
  };

  const btnName = (
    <p className="flex items-center justify-center gap-1 font-medium">
      <CirclePlus size={18} strokeWidth={3} />
      Add New User
    </p>
  );

  const searchInput = (
    <article className="w-48">
      <SearchDebounceInput
        setterFunction={onSearchValueChange}
        placeholder={"Search name here..."}
        className="pl-8 sm:w-[200px] lg:w-[300px]"
      />
    </article>
  );

  const newAccount = { userInfo: null, isAccountUpdate: false };

  const {
    isLoading,
    data: paginatedUsers,
    isPlaceholderData,
  } = useGetPaginatedUsers(Number(page - 1), 50, username);

  const onPageClick = (pageNumber) => {
    setSearchParams((prev) => {
      prev.set("page", pageNumber);
      return prev;
    });
  };

  // RENDER SECTION
  return (
    <>
      <TitleCard topMargin="-mt-2">
        <header className="-mt-6 mb-4 flex items-center justify-between">
          <div className="flex gap-3">
            <TopSideButtons
              btnName={btnName}
              title="Add New User"
              bodyType={MODAL_BODY_TYPES.USERS_ADD_NEW}
              extraObject={newAccount}
              size={"max-w-2xl"}
            />
            {searchInput}
          </div>
          <div>
            <article className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const oldPage = Math.max(Number(page) - 1, 0);
                  onPageClick(oldPage);
                }}
                disabled={Number(page) === 1}
              >
                Previous
              </Button>
              {/* <label className="px-2 text-sm">{page}</label> */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!isPlaceholderData && !paginatedUsers?.hasMore) {
                    const nextPage = Number(page) + 1;
                    onPageClick(nextPage);
                  }
                }}
                disabled={isPlaceholderData || paginatedUsers?.hasMore}
              >
                Next
              </Button>
            </article>
          </div>
        </header>
        {isLoading ? (
          <LoadingSpinner />
        ) : !isLoading && paginatedUsers ? (
          <UsersTable
            onUpdateUserStatus={onUpdateUserStatus}
            paginatedUsers={paginatedUsers}
            isPlaceholderData={isPlaceholderData}
            openModal={openModal}
          />
        ) : (
          <NoRecordsFound>No Records Found</NoRecordsFound>
        )}
      </TitleCard>
    </>
  );
}
