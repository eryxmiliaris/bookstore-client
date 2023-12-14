import { useState } from "react";
import toast from "react-hot-toast";
import { Rating } from "@mui/material";

import Button from "../../components/Button";

function ReviewForm({
  reviewId,
  onSubmit: submitReview,
  isLoading,
  initialValues,
}) {
  const [reviewRating, setReviewRating] = useState(
    initialValues?.reviewRating || 9,
  );
  const [reviewText, setReviewText] = useState(initialValues?.text || "");

  const handleSubmitReview = async () => {
    if (reviewRating === 0 || reviewText === "" || reviewText.length < 20) {
      toast.error("Review text should have at least 20 symbols");
      return;
    }
    submitReview({ reviewId, reviewRating, reviewText });
  };

  return (
    <div className="mx-4 flex flex-col items-center gap-4 p-4">
      <p className="text-xl font-semibold">Your review:</p>
      <Rating
        max={10}
        defaultValue={10}
        size="medium"
        value={reviewRating}
        onChange={(e, newValue) => {
          setReviewRating(newValue);
        }}
      />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={8}
      />
      <Button disabled={isLoading} onClick={handleSubmitReview}>
        Submit
      </Button>
    </div>
  );
}

export default ReviewForm;
