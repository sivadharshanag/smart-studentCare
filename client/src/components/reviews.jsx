import React from "react";
import "./reviews.css";

const Reviews = () => {
  return (
    <section id="reviews" className="reviews-section">
      <div className="section-content">
        <h2 className="section-title">Students reviews</h2>

        <div className="reviews-grid">
          {/* Review 1 */}
          <div className="review-card">
            <div className="reviewer-avatar">
              <div className="avatar-circle pink">
                <div className="avatar-inner"></div>
              </div>
              <div className="avatar-decoration dec-1"></div>
              <div className="avatar-decoration dec-2"></div>
              <div className="avatar-decoration dec-3"></div>
            </div>
            <h3 className="reviewer-name">Anna Tyuneva</h3>
            <p className="review-text">
              The course is great! Teachers talks very interesting and
              accessible. Thank you very much!
            </p>
          </div>

          {/* Review 2 */}
          <div className="review-card">
            <div className="reviewer-avatar">
              <div className="avatar-circle blue">
                <div className="avatar-inner"></div>
              </div>
              <div className="avatar-decoration dec-1"></div>
              <div className="avatar-decoration dec-2"></div>
              <div className="avatar-decoration dec-3"></div>
            </div>
            <h3 className="reviewer-name">Mykola Dunayev</h3>
            <p className="review-text">
              The course is clear enough. Well explained a lot of practice. I
              recommend to everyone!
            </p>
          </div>

          {/* Review 3 */}
          <div className="review-card">
            <div className="reviewer-avatar">
              <div className="avatar-circle orange">
                <div className="avatar-inner"></div>
              </div>
              <div className="avatar-decoration dec-1"></div>
              <div className="avatar-decoration dec-2"></div>
              <div className="avatar-decoration dec-3"></div>
            </div>
            <h3 className="reviewer-name">Nastya Kozarchuk</h3>
            <p className="review-text">
              The training was in one breath. Very accessible courses,
              everything is very clear and good.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
