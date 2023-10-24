import { CircularProgress } from "@mui/material";

function Spinner() {
  return (
    <div className="container mx-auto py-8 text-center">
      <CircularProgress color="primary" />
    </div>
  );
}

export default Spinner;
