import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "./Auth";
import { Save } from "./Utils/Save";
import NoteBottom from "./NoteBottom";
import { MdOutlineInvertColors } from "react-icons/md";
import ColorPicker from "./ColorPicker";

export default function Note({ setNote, groups, group, note, updateNotes }) {
  const [saved, setSaved] = useState(
    note.new === true ? Save.edited : Save.unedited
  );
  const [showPalette, setShowPalette] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState(note.color);
  const textarea = useRef(null);
  const title = useRef(null);
  const { userContent } = useContext(UserContext);

  const editorChange = (text) => {
    if (textarea.current.value !== note.content && saved !== Save.edited)
      setSaved(Save.edited);
    else if (textarea.current.value === note.content && saved !== Save.unedited)
      setSaved(Save.unedited);
  };
  const setColor = (color) => {
    if (color !== note.color && saved !== Save.edited) setSaved(Save.edited);
    else if (color === note.color && saved !== Save.unedited)
      setSaved(Save.unedited);

    setBgColor(color);
  };
  useEffect(() => {
    setSaved(Save.unedited);
    setBgColor(note.color);
    textarea.current.value = note.content;
    title.current.value = note.title;
  }, [note]);

  const canWrite = note.writer_username === userContent.username;
  return (
    <>
      <div
        className="tile relative h-content px-2 py-2 w-note "
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex">
          <button
            onClick={() => setShowPalette(true)}
            className="note-btn w-7 h-7 p-1 mt-2 ml-2 mr-1"
          >
            <MdOutlineInvertColors className="absolute" size={20} />
          </button>
          <input
            ref={title}
            className="tile-label focus:ring-0 focus:outline-none  mr-15 mt-1"
            style={{ backgroundColor: "transparent" }}
            defaultValue={note.title}
            readOnly={!canWrite}
          />
          <span
            className={
              "w-7 h-7 p-1 mt-2 ml-auto mr-1" + (loading ? "animate-pulse" : "")
            }
          >
            {saved}
          </span>
        </div>

        {loading ? <div className="spinner-note h-text mt-6" /> : null}
        <textarea
          hidden={loading}
          ref={textarea}
          className="resize-none rounded-md w-full h-text  mt-6 focus:outline-none focus:ring-gray-800 focus:ring-2 px-2"
          style={{ backgroundColor: "transparent" }}
          defaultValue={note.content}
          onChange={editorChange}
          readOnly={!canWrite || loading}
        />
        <NoteBottom
          note={note}
          color={bgColor}
          group={group}
          groups={groups}
          title={title}
          textarea={textarea}
          setNote={setNote}
          updateNotes={updateNotes}
          setSaved={setSaved}
          setLoading={setLoading}
        />

        <ColorPicker
          setShow={setShowPalette}
          show={showPalette}
          defaultColor={note.color}
          color={bgColor}
          setColor={setColor}
          className=" absolute top-12 left-4"
        />
      </div>
    </>
  );
}
