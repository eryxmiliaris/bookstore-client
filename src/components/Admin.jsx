import { useQuery } from "@tanstack/react-query";
import axios from "../util/axios";

function Admin() {
  const { data: content, isLoading } = useQuery(["adminData"], async () => {
    const response = await axios.get("/test/admin");
    return response.data;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Test Controller</h2>
      <p>{content}</p>
    </div>
  );
}

export default Admin;
