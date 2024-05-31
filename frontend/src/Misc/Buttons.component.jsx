import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

const size = 50

export const ExpandButton = ({className, isExpanded, setExpanded }) => ( 
    <button className={className} onClick={()=>setExpanded(!isExpanded)}>
    {isExpanded ? <MdKeyboardArrowUp size={size} /> : <MdKeyboardArrowDown size={size} />}

    </button>
  ) 