import { useState } from "react";
import { deleteGroup } from "./Api";
import ConfirmModal from "./Modals/ConfirmModal";

export default function NotesGroups({
  setGroup,
  selectedGroup,
  groups,
  fetchGroups,
}) {
  const [deleteId, setDeleteId] = useState(null);

  return (
    <div className="my-2">
      <h1 className="font-roboto text-4xl">Groups</h1>
      {groups.map((group) => (
        <div className="flex relative w-5/6 h-16 m-auto" key={group.id}>
          <button
            className={
              "static rounded-lg text-center  bg-gray-200 text-2xl min-w-full px-10 py-1 my-2 hover:bg-gray-300 hover: anim" +
              (selectedGroup !== null && group.id === selectedGroup.id
                ? " border-green-500 border-b-4"
                : "")
            }
            onClick={async () => {
              await setGroup(group);
            }}
          >
            {group.name}
          </button>
          {group.name !== "All" &&
          selectedGroup !== null &&
          group.id !== selectedGroup.id ? (
            <button
              id="btn-delete-group"
              onClick={() => {
                setDeleteId(group.id);
              }}
              className="opacity-0 hover:opacity-100 rounded-md text-xl rounded-l-none w-8 py-1 my-2 bg-red-600 absolute right-0 h-12"
            >
              X{" "}
            </button>
          ) : null}
          <ConfirmModal
            title={"Delete Group"}
            open={deleteId !== null}
            onClose={() => {
              setDeleteId(null);
            }}
            onConfirm={async () => {
              await deleteGroup(deleteId);
              await fetchGroups();
            }}
          >
            Are you sure you want to delete this Group?
          </ConfirmModal>
        </div>
      ))}
    </div>
  );
}
