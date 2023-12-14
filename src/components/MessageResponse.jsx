import { IconContext } from "react-icons";
import { AiOutlineWarning } from "react-icons/ai";

function MessageResponse({ message }) {
  return (
    <>
      {message && (
        <div className="mb-4 flex items-center rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
          <IconContext.Provider value={{ className: "w-6 h-6 mr-2" }}>
            <AiOutlineWarning /> {message}
          </IconContext.Provider>
        </div>
      )}
    </>
  );
}

export default MessageResponse;
