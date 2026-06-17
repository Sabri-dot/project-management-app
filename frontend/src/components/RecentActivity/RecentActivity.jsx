function RecentActivity({
  activities,
}) {

  const formatTime = (
    dateString
  ) => {

    const now =
      new Date();

    const date =
      new Date(dateString);

    const diffMinutes =
      Math.floor(
        (now - date) /
          1000 /
          60
      );

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    }

    const diffHours =
      Math.floor(
        diffMinutes / 60
      );

    if (diffHours < 24) {
      return `${diffHours} hour ago`;
    }

    const diffDays =
      Math.floor(
        diffHours / 24
      );

    return `${diffDays} day ago`;

  };

  return (
    <div className="bg-white border rounded-4 p-4 h-100">

      <h3 className="fw-bold mb-4">
        Recent Activity
      </h3>

      {activities.length === 0 ? (

        <p className="text-muted">
          No recent activity
        </p>

      ) : (

        activities.map(
          (
            activity,
            index
          ) => (

            <div
              key={index}
              className="d-flex mb-4"
            >

              <img
                src={
                  activity.avatar ||
                  "https://i.pravatar.cc/150"
                }
                alt=""
                width="42"
                height="42"
                className="rounded-circle me-3"
                style={{
                  objectFit:
                    "cover",
                }}
              />

              <div>

                <div
                  style={{
                    fontSize:
                      "15px",
                    lineHeight:
                      "1.5",
                  }}
                >

                  <strong>
                    {
                      activity.full_name
                    }
                  </strong>{" "}

                  {
                    activity.action
                  }

                </div>

                <div
                  style={{
                    color:
                      "#94a3b8",
                    marginTop:
                      "4px",
                    fontSize:
                      "13px",
                  }}
                >

                  {formatTime(
                    activity.created_at
                  )}

                </div>

              </div>

            </div>

          )
        )

      )}

    </div>
  );

}

export default RecentActivity;