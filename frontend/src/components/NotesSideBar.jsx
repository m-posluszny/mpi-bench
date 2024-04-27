import { useState, useContext } from "react";
import TextInputModal from "./Modals/TextInputModal";
import { addGroup } from "./Api";
import { AuthContext } from "./Auth";
export default function NotesSideBar({ onCreateNote, updateGroups, children }) {
  const [showCreate, setShowCreate] = useState(false);
  const { authRequest } = useContext(AuthContext);
  const createGroup = async (groupName) => {
    const jsonContent = {
      name: groupName,
    };
    await authRequest(addGroup, jsonContent);
    await updateGroups();
  };

  return (
    <div className="w-1/6  h-panel float-left min-w-min">
      <button
        onClick={onCreateNote}
        className="rounded-lg  bg-gray-200 text-2xl w-5/6 py-3 mb-2 mx-auto border-b-4 border-yellow-400 hover:bg-gray-300"
      >
        Create Note
      </button>
      <button
        onClick={() => setShowCreate(true)}
        className="rounded-lg  bg-gray-200 text-2xl w-5/6 py-3 mb-2 mx-auto border-b-4 border-purple-400 hover:bg-gray-300"
      >
        Create Group
      </button>

      <TextInputModal
        title={"Create Group"}
        open={showCreate}
        onClose={() => {
          setShowCreate(false);
        }}
        onConfirm={async (value) => {
          await createGroup(value);
        }}
      >
        Enter group name
      </TextInputModal>
      {children}
    </div>
  );
}
