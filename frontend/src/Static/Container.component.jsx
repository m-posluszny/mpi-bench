const Background = "bg-slate-800";

export const Container = ({ children }) => (
    <div className={`flex flex-col ${Background} h-screen`} >
        {children}
    </div>
)