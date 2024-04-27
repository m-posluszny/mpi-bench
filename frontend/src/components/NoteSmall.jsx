import NoteStatus from "./NoteStatus";
import { UserContext } from "./Auth";
import { useContext } from "react";

export default function NoteSmall({ note, setNote }) {
  const { userContent } = useContext(UserContext);
  return (
    <div
      key={note}
      className="relative tile h-56 w-52 opacity-80 border-4 border-transparent hover:opacity-100 overflow-hidden"
      onClick={() => setNote(note)}
      style={{ backgroundColor: note.color }}
    >
      <div className="flex">
        <h3 className="tile-label overflow-hidden">{note.title}</h3>
        {userContent.username === note.writer_username &&
        note.writer_username !== note.author_username ? (
          <div className="ml-auto rounded-full w-5 h-5 bg-yellow-500 p-1 mr-1 mt-1" />
        ) : null}
      </div>

      <div className="tile-content h-28 overflow-hidden">{note.content}</div>
      <div className="flex gap-2">
        <NoteStatus
          author={note.author_username}
          writer={note.writer_username}
        />
      </div>
    </div>
  );
}
