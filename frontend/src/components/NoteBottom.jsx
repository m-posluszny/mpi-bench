import TextInputModal from "./Modals/TextInputModal";
import ChoiceModal from "./Modals/ChoiceModal";
import ConfirmModal from "./Modals/ConfirmModal";
import NoteStatus from "./NoteStatus";
import {
  BsFillCloudUploadFill,
  BsReplyFill,
  BsFillTrashFill,
  BsFillBookmarkPlusFill,
  BsFillBookmarkDashFill,
} from "react-icons/bs";
import { addNote, editNote, editGroup, removeNote } from "./Api";
import { useState, useContext } from "react";
import { UserContext } from "./Auth";
import { Save } from "./Utils/Save";
import { getDate } from "./Utils/Date";

export default function NoteBottom({
  note,
  color,
  group,
  groups,
  title,
  textarea,
  setNote,
  updateNotes,
  setSaved,
  setLoading,
}) {
  const { userContent } = useContext(UserContext);
  const [showAdd, setShowAdd] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteFromGroup, setShowDeleteFromGroup] = useState(false);
  const canWrite = note.writer_username === userContent.username;
  const canDelete = note.author_username === userContent.username;
  const icon_size = 20;

  const addToGroup = async (g, noteId) => {
    if (noteId === undefined || noteId === null) noteId = note.id;
    setLoading(true);
    let nids = g.notes.map((n) => n.id);
    if (!nids.includes(noteId)) nids.push(noteId);
    else {
      setLoading(false);
      throw new Error("Note already in group " + g.name);
    }
    const jsonContent = {
      name: g.name,
      notes_id: nids,
    };
    try {
      await editGroup(g.id, jsonContent);
      await updateNotes();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const shareNote = async (writerName) => {
    setLoading(true);
    const jsonContent = {
      title: title.current.value,
      content: textarea.current.value,
      writer_username: writerName,
      color: color,
      reader_array: note.reader_array,
    };
    try {
      const data = await editNote(note.id, jsonContent);
      setNote(data);
      setLoading(false);
      await updateNotes();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  const sendNote = async () => {
    setLoading(true);
    const jsonContent = {
      title: title.current.value,
      content: textarea.current.value,
      writer_username: userContent.username,
      color: color,
      reader_array: note.reader_array,
    };
    let create = note.id === undefined;
    try {
      const data = create
        ? await addNote(jsonContent)
        : await editNote(note.id, jsonContent);
      setNote(data);
      setLoading(false);
      setSaved(Save.saved);
      if (group.id !== -2 && create) await addToGroup(group, data.id);
      await updateNotes();
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteNote = async () => {
    setLoading(true);
    await removeNote(note.id);
    setNote(null);
    setLoading(false);
    setSaved(Save.saved);
    await updateNotes();
  };

  const deleteNoteFromGroup = async () => {
    setLoading(true);
    let js = {
      name: group.name,
      notes_id: group.notes.filter((n) => n.id !== note.id).map((el) => el.id),
    };
    await editGroup(group.id, js);
    setNote(null);
    setLoading(false);
    setSaved(Save.saved);
    await updateNotes();
  };

  return (
    <div className="flex m-2 gap-2">
      <NoteStatus author={note.author_username} writer={note.writer_username} />
      {!note.new && canWrite ? (
        <>
          <button onClick={() => setShowShare(true)} className="note-btn ">
            <BsReplyFill className="m-auto" size={icon_size} />
          </button>
        </>
      ) : null}
      {!note.new ? (
        <>
          <span className="text-md ml-auto">
            <h1 className="text-sm">Last Edit</h1>
            <h1 className="text-lg">{getDate(note.modification_date)}</h1>
          </span>
          <button onClick={() => setShowAdd(true)} className="ml-auto note-btn">
            <BsFillBookmarkPlusFill className=" m-auto" size={icon_size} />
          </button>
          {group.id !== -2 ? (
            <button
              onClick={() => setShowDeleteFromGroup(true)}
              className="note-btn"
            >
              <BsFillBookmarkDashFill className="m-auto" size={icon_size} />
            </button>
          ) : null}
        </>
      ) : null}
      {canWrite ? (
        <>
          <button
            id="save-btn"
            onClick={sendNote}
            className={"note-btn" + (note.new ? " ml-auto" : "")}
          >
            <BsFillCloudUploadFill className=" m-auto" size={icon_size} />
          </button>
          {!note.new && canDelete ? (
            <button
              id="click-delete"
              onClick={() => setShowDelete(true)}
              className="note-btn"
            >
              <BsFillTrashFill className=" m-auto" size={icon_size} />
            </button>
          ) : null}
          <TextInputModal
            title={"Send Note"}
            open={showShare}
            onClose={() => {
              setShowShare(false);
            }}
            onConfirm={shareNote}
          >
            Enter username of the user who will receive note
          </TextInputModal>
          <ConfirmModal
            title={"Delete Note"}
            open={showDelete}
            onClose={() => {
              setShowDelete(false);
            }}
            onConfirm={deleteNote}
          >
            Are you sure you want to delete this Note?
          </ConfirmModal>
          <ConfirmModal
            title={"Delete Group"}
            open={showDeleteFromGroup}
            onClose={() => {
              setShowDeleteFromGroup(false);
            }}
            onConfirm={deleteNoteFromGroup}
          >
            Are you sure you want to delete this Note from this Group?
          </ConfirmModal>
        </>
      ) : null}
      <ChoiceModal
        title={"Add to Group"}
        open={showAdd}
        options={groups
          .filter((obj) => obj.id !== -2)
          .map((g) => ({
            value: g,
            label: g.name,
          }))}
        onClose={() => {
          setShowAdd(false);
        }}
        onConfirm={(option) => addToGroup(option.value)}
      >
        Select Group
      </ChoiceModal>
    </div>
  );
}
