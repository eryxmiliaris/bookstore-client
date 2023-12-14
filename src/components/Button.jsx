/* eslint-disable react/prop-types */
function Button({
  children,
  onClick,
  type,
  className,
  disabled = false,
  disabledText = children,
}) {
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
    case "green":
      style =
        "w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none";
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
      {disabled ? disabledText : children}
    </button>
  );
}

export default Button;
