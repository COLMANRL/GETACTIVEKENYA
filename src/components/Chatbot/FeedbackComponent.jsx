
import React, { useState } from 'react';

const FeedbackComponent = ({ messageId, onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedback = (isHelpful) => {
    setFeedback(isHelpful);
    if (!isHelpful) {
      setShowCommentBox(true);
    } else {
      submitFeedback(isHelpful, '');
    }
  };

  const submitFeedback = (isHelpful, commentText) => {
    onSubmitFeedback(messageId, isHelpful, commentText);
    setIsSubmitted(true);
    setShowCommentBox(false);
  };

  const handleCommentSubmit = () => {
    submitFeedback(feedback, comment);
  };

  if (isSubmitted) {
    return (
      <div className="feedback-submitted">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="message-feedback">
      {!feedback ? (
        <>
          <span className="feedback-prompt">Was this response helpful?</span>
          <button
            className="feedback-btn thumbs-up"
            onClick={() => handleFeedback(true)}
            aria-label="Thumbs up"
          >
            👍
          </button>
          <button
            className="feedback-btn thumbs-down"
            onClick={() => handleFeedback(false)}
            aria-label="Thumbs down"
          >
            👎
          </button>
        </>
      ) : showCommentBox ? (
        <div className="feedback-comment-container">
          <textarea
            className="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How can we improve this response?"
            rows={2}
          />
          <div className="feedback-actions">
            <button
              className="feedback-submit-btn"
              onClick={handleCommentSubmit}
            >
              Submit
            </button>
            <button
              className="feedback-cancel-btn"
              onClick={() => setShowCommentBox(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FeedbackComponent;
