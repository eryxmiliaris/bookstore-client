import Button from "../../components/Button";

const formatSeconds = (s) => new Date(s * 1000).toISOString().substr(11, 8);

function BookNote({ note, handleDelete, isLoading, handleGoTo }) {
  const { id, name, text, position } = note;

  return (
    <div className="flex flex-col items-center justify-between gap-2 text-center">
      <p className="text-xl">{name}</p>
      <p>{text}</p>
      <div className="flex w-1/2  flex-col gap-2 sm:flex-row">
        <Button onClick={() => handleGoTo(position)}>
          Go to {formatSeconds(position)}
        </Button>
        <Button
          disabled={isLoading}
          type="red"
          onClick={() => handleDelete(id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default BookNote;
