export default function TitleForm({ children, isLoading }) {
  return (
    <div className=" w-96 mt-20 bg-gray-300 mx-auto rounded-2xl p-5 pb-1">
      <h1 className=" text-6xl mb-10 font-sans">SlowNote</h1>
      {isLoading ? <div className="spinner h-24" /> : children}
    </div>
  );
}
