export default function InputForm({ placeholder, type, error, registerObj }) {
  return (
    <div className="my-5">
      <input
        className={
          "rounded-xl h-8 w-5/6 p-2" +
          ((error && error.message) !== undefined
            ? " border-2 border-red-600"
            : "")
        }
        placeholder={placeholder}
        type={type}
        {...registerObj}
      />
      <div className=" text-red-600">{error && error.message}</div>
    </div>
  );
}
