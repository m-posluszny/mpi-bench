import { defaultActiveColor } from "./consts"

export const Tile = ({ children, isActive = false, activeColor = defaultActiveColor, onClick }) => {

    const activeStyle = isActive ? `${activeColor}` : ""
    const hoverStyle = onClick ? "hover:bg-slate-700" : ""
    return <div
        onClick={onClick ? onClick : () => { }}
        className={`flex bg-slate-500 rounded-xl p-3 my-1 ${activeStyle} ${hoverStyle}`}>
        {children}
    </div>
}

export const Tiles = ({ children }) => (
    <div
        className='ml-3 bg-slate-600 h-min p-3 rounded-xl flex-co'>
        {children}
    </div>
)

export const Header = ({ title, btnTitle, btnClass, className = "", onClick = () => { } }) => {
    return <div className={`flex mb-3 ${className}`}>
        <h2 className="font-bold">
            {title}
        </h2>
        {
            btnTitle &&
            <button className={`ml-auto 
          p-1 rounded-xl bg-gray-500 text-xs font-bold px-2 ${btnClass} hover:bg-slate-300`} onClick={() => onClick()}>{btnTitle}</button>
        }
    </div >

}

export const FormRow = ({ children }) => (
    <div className="my-3 p-auto flex">
        {children}
    </div>
)