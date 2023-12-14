import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Divider } from "@mui/material";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";

import Spinner from "../../components/Spinner";
import Review from "../bookpage/Review";

function Reviews() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, isAdmin, userIsLoading } = useAuth();

  useEffect(() => {
    if (!userIsLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, userIsLoading, navigate]);

  const [pageNumber, setPageNumber] = useState(0);
  const handlePageChange = function (event, value) {
    setPageNumber(value - 1);
    queryClient.invalidateQueries(["reviews"]);
  };

  const [findByUsername, setFindByUsername] = useState("");

  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: [`reviews`, pageNumber, findByUsername],
    queryFn: async () => {
      const response = await axios.get(
        `/admin/reviews?pageNumber=${pageNumber}${
          findByUsername !== null ? `&username=${findByUsername}` : ""
        }`,
      );
      return response.data;
    },
  });

  const reviews = reviewsResponse?.content;

  const { mutate: deleteReview, isLoading: isDeletingReview } = useMutation({
    mutationFn: (reviewId) => {
      return axios.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      toast.success("Review has been succeffully removed");
      queryClient.invalidateQueries([`reviews`]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return (
    <div className="my-5 space-y-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={findByUsername}
          onChange={(e) => setFindByUsername(e.target.value)}
          placeholder="Find by username..."
          className="w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring"
        />
        {findByUsername && (
          <span
            className="absolute inset-y-0 right-10 flex cursor-pointer items-center pr-3"
            onClick={() => setFindByUsername("")}
          >
            <ClearIcon />
          </span>
        )}
        <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
          <SearchIcon />
        </span>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ul className="flex flex-col gap-6">
            {reviews.map((review) => (
              <>
                <Divider />
                <Review
                  key={review.id}
                  review={review}
                  currentUser={user}
                  isAdmin={isAdmin}
                  isLoading={isDeletingReview}
                  handleRemoveReview={deleteReview}
                />
              </>
            ))}
          </ul>

          <div className="my-10 flex items-center justify-center">
            <Pagination
              count={
                reviewsResponse.totalPages === 0
                  ? 1
                  : reviewsResponse.totalPages
              }
              page={reviewsResponse.pageNumber + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Reviews;
