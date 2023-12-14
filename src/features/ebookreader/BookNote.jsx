import Button from "../../components/Button";

function BookNote({ note, darkMode, handleDelete, handleGoTo }) {
  const { id, name, text, position } = note;

  return (
    <div
      className={`space-y-2 rounded-xl border p-4 shadow-lg ${
        darkMode ? "bg-violet-900 text-white" : "bg-white text-black"
      }`}
    >
      <p className="text-xl font-semibold">{name}</p>
      <p>{text}</p>
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <Button
          className="whitespace-nowrap"
          onClick={() => handleGoTo(position)}
        >
          Go to
        </Button>
        <Button type="red" onClick={() => handleDelete(id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default BookNote;
