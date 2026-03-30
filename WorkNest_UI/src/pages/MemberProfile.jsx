import { useEffect, useState } from "react";
import API from "../services/api";

function MemberProfile() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const response = await API.get("owner/profile/");
      setProfile(response.data.data);

    } catch (error) {
      console.error("Error fetching member profile", error);
    }
  };

  if (!profile) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-lg p-8 w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          Member Profile
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-gray-500 text-sm">Username</p>
            <p className="font-semibold">{profile.username}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold">{profile.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-semibold text-green-600">
              {profile.role}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Organization</p>
            <p className="font-semibold">
              {profile.organization || "Not Assigned"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default MemberProfile;