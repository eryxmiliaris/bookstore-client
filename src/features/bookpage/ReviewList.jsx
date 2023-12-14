import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Divider, Rating } from "@mui/material";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";

import Button from "../../components/Button";
import Review from "./Review";
import ModalWindow from "../../components/ModalWindow";
import ReviewForm from "./ReviewForm";

function ReviewList({ reviews, isOrdered }) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { user, isAdmin } = useAuth();

  const [addReviewOpen, setAddReviewOpen] = useState(false);

  const { mutate: submitReview, isLoading: isSubmittingReview } = useMutation({
    mutationFn: ({ reviewId, reviewRating, reviewText }) => {
      return axios.post(`/reviews?bookId=${Number(id)}`, {
        rating: reviewRating,
        text: reviewText,
      });
    },
    onSuccess: () => {
      toast.success("Review has been succeffully posted!");
      setAddReviewOpen(false);
      queryClient.invalidateQueries([`book${id}`]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return (
    <div>
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Reviews </h2>
          {isOrdered && (
            <>
              <Button
                className="w-min sm:w-[200px]"
                onClick={() => setAddReviewOpen(true)}
              >
                Add review
              </Button>
            </>
          )}
        </div>
        <ul className="flex flex-col gap-6">
          {reviews.map((review) => (
            <>
              <Divider />
              <Review
                key={review.id}
                bookId={id}
                review={review}
                currentUser={user}
                isAdmin={isAdmin}
              />
            </>
          ))}
        </ul>
      </div>
      <ModalWindow open={addReviewOpen} onClose={() => setAddReviewOpen(false)}>
        <ReviewForm onSubmit={submitReview} isLoading={isSubmittingReview} />
      </ModalWindow>
    </div>
  );
}

export default ReviewList;
