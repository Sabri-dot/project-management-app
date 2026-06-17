function AdminLatestUsers({
  users = [],
}) {
  return (
    <div className="bg-white border rounded-4 p-4 shadow-sm">

      <h4 className="fw-bold mb-4">
        Latest Users
      </h4>

      <div className="table-responsive">

        <table className="table align-middle">

          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user.id}>

                <td>

                  <div className="d-flex align-items-center gap-3">

                    <img
                      src={
                        user.avatar ||
                        "https://i.pravatar.cc/150"
                      }
                      alt=""
                      width="40"
                      height="40"
                      className="rounded-circle"
                    />

                    <strong>
                      {user.full_name}
                    </strong>

                  </div>

                </td>

                <td>

                  <span className="badge bg-primary">
                    {user.role}
                  </span>

                </td>

                <td>{user.email}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminLatestUsers;