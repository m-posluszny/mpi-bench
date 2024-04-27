import React from "react";
import { BsFillPenFill, BsFillPersonFill } from "react-icons/bs";

export default function NoteStatus({ author, writer }) {
  return (
    <>
      <span className="h-12 flex text-left p-1 bg-gray-50 rounded-3xl">
        <BsFillPersonFill className="p-1 my-auto" size={28} />
        <h5 className="p-1 pr-3">{author}</h5>
      </span>
      <span className="h-12 flex text-left p-1 bg-gray-50 rounded-3xl">
        <BsFillPenFill className="p-1 my-auto" size={28} />
        <h5 className="p-1 pr-3">{writer}</h5>
      </span>
    </>
  );
}
