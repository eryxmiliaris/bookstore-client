function Button({ children, onClick, type, className, disabled = false }) {
  let style = "";
  switch (type) {
    case "primary":
      style =
        "w-full rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-600 focus:outline-none";
      break;
    case "red":
      style =
        "w-full rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800 focus:outline-none";
      break;
    default:
      style =
        "w-full rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-600 focus:outline-none";
      break;
  }
  return (
    <button
      disabled={disabled}
      className={style + " " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
