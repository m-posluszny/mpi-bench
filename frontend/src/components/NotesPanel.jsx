import NoteSmall from "./NoteSmall";
import Note from "./Note";

export default function NotesPanel({
  group,
  groups,
  usedNote,
  setNote,
  updateNotes,
}) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="">
        {(() => {
          if (usedNote !== null) {
            return (
              <Note
                note={usedNote}
                group={group}
                groups={groups}
                setNote={setNote}
                updateNotes={updateNotes}
              />
            );
          }
        })()}
      </div>
      <div className="note-panel ">
        <div className="flex gap-4 pb-96 flex-wrap h-full overflow-y-auto flex-none">
          {group
            ? group.notes.map((note) => (
                <NoteSmall
                  note={note}
                  setNote={(note) => {
                    if (note !== usedNote) setNote(note);
                    else setNote(null);
                  }}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
