import "./NoticeCard.css";

function NoticeCard({ notice }) {
  return (
    <div className="notice-card">
      <p className="notice-card-title">
        {notice.title} <span>{notice.date}</span>
      </p>
      <p className="notice-card-message">{notice.message}</p>
    </div>
  );
}

export default NoticeCard;

