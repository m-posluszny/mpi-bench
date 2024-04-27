import NotesPanel from "./NotesPanel";
import NotesSideBar from "./NotesSideBar";
import NotesGroups from "./NotesGroups";
import { useState, useEffect, useContext } from "react";
import { getNotes, getGroups, getGroup } from "./Api";
import { AuthContext, UserContext } from "./Auth";

export default function NotesView() {
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [usedNote, setUsedNote] = useState(null);
  const { authRequest } = useContext(AuthContext);
  const { userContent } = useContext(UserContext);
  const showBlank = () => {
    let emptyNote = {
      title: "Untitled",
      content: "",
      author_username: userContent.username,
      writer_username: userContent.username,
      reader_array: [userContent.username],
      color: "#A9A9A9",
      new: true,
    };
    setUsedNote(emptyNote);
  };

  const changeGroup = async (g) => {
    setGroup(await fetchGroup(g.id));
    setUsedNote(null);
  };

  const fetchGroup = async (group_id) => {
    console.log(group_id);
    if (group_id === -2) {
      let fetchedNotes = null;
      try {
        fetchedNotes = await authRequest(getNotes);
      } catch (error) {
        fetchedNotes = [];
      }
      const all = { name: "All", notes: fetchedNotes, id: -2 };
      return all;
    }
    try {
      let resp = await authRequest(getGroup, group_id);
      return resp;
    } catch (error) {}
    return null;
  };

  const updateGroup = async (group_id) => {
    setGroup(await fetchGroup(group_id));
  };

  const fetchGroups = async () => {
    let fetchedGroups;
    try {
      fetchedGroups = await authRequest(getGroups);
    } catch (error) {
      fetchedGroups = [];
    }
    const all = { name: "All", notes: [], id: -2 };
    const fetched = [all].concat(fetchedGroups);
    setGroups(fetched);
    return fetched;
  };
  useEffect(() => {
    const initFetch = async () => {
      changeGroup((await fetchGroups())[0]);
    };
    initFetch();
  }, []);
  return (
    <>
      <NotesSideBar onCreateNote={showBlank} updateGroups={fetchGroups}>
        <NotesGroups
          fetchGroups={fetchGroups}
          setGroup={changeGroup}
          selectedGroup={group}
          groups={groups}
        />
      </NotesSideBar>

      <NotesPanel
        usedNote={usedNote}
        setNote={setUsedNote}
        group={group}
        groups={groups}
        updateNotes={() => {
          updateGroup(group.id);
        }}
      />
    </>
  );
}
