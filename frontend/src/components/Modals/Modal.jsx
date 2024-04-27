export default function Modal({ children, open, onClose }) {
  if (!open) {
    return <></>;
  }
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 -top-80 outline-none focus:outline-none"
        onClick={onClose}
      >
        <div
          className="relative w-auto my-6 mx-auto max-w-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-5">
            {children}
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
