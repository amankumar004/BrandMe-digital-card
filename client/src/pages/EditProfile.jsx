import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

export default function EditProfile() {

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to edit your profile.");
      navigate("/login");
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    countryCode: "+91",
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    socials: {
      twitter: "",
      linkedin: "",
      github: "",
    },
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to fetch profile");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          ...data, // fill existing fields
        }));
      } catch (error) {
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("contact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));
    } else if (name.includes("socials.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Update handleSubmit to set loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- Add this line

    // ✅ Avoid appending country code repeatedly
    let phone = formData.contact.phone.trim();
    const code = formData.countryCode.trim();

    // Remove any previously added country code if present
    if (phone.startsWith(code)) {
      phone = phone.slice(code.length).trim();
    }

    const fullPhone = `${code} ${phone}`;
    const form = new FormData();

    form.append("title", formData.title);
    form.append("bio", formData.bio);
    form.append("contact[email]", formData.contact.email);
    form.append("contact[website]", formData.contact.website);
    form.append("contact[phone]", fullPhone);
    form.append("socials[twitter]", formData.socials.twitter);
    form.append("socials[linkedin]", formData.socials.linkedin);
    form.append("socials[github]", formData.socials.github);
    
    if (selectedFile) {
      form.append("avatar", selectedFile);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
        setLoading(false); // <-- Add this line
        return;
      }

      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error updating profile");
      setLoading(false); // <-- Add this line
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-indigo-50 shadow-xl rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mt-4">Title</h3>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          placeholder="Title (e.g. Frontend Developer)"
          className="w-full border p-2 rounded"
        />

        <h3 className="text-lg font-semibold mt-4">Bio</h3>
        <textarea
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          placeholder="Short Bio"
          className="w-full border p-4 rounded"
        ></textarea>

        <h3 className="text-lg font-semibold mt-4">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <h3 className="text-sm font-semibold mt-4">Phone No</h3>
          <div className="flex col-span-2 gap-2">
            <select
              name="contact.countryCode"
              value={formData.contact?.countryCode || "+91"}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    countryCode: e.target.value,
                  },
                }));
              }}
              className="border p-2 rounded w-24"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+81">🇯🇵 +81</option>
              {/* Add more as needed */}
            </select>

            <input
              type="text"
              name="contact.phone"
              value={formData.contact?.phone || ""}
              onChange={handleChange}
              placeholder="Phone number"
              className="border p-2 rounded w-full"
            />
          </div>

          <h3 className="text-sm font-semibold mt-4">Email</h3>
          <input
            type="text"
            name="contact.email"
            value={formData.contact?.email || ""}
            onChange={handleChange}
            placeholder="Public Email"
            className="border p-2 rounded col-span-2"
          />
          <h3 className="text-sm font-semibold mt-4">Website</h3>
          <input
            type="text"
            name="contact.website"
            value={formData.contact?.website || ""}
            onChange={handleChange}
            placeholder="Website"
            className="border p-2 rounded col-span-2"
          />
        </div>

        <h3 className="text-lg font-semibold mt-4">Social Links</h3>
        <div className="grid grid-cols-2 gap-4">
          {["twitter", "linkedin", "github"].map((platform) => (
            <div key={platform} className="flex flex-col">
              <h3 className="text-sm font-semibold capitalize mb-1">{platform}</h3>
              <input
                type="text"
                name={`socials.${platform}`}
                value={formData.socials?.[platform] || ""}
                onChange={handleChange}
                placeholder={`Enter your ${platform}`}
                className="border p-2 rounded"
              />
          </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-4">Profile Picture</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if(file && file.size > 5*1024*1024){
              toast.error("File size should be less than 5MB");
              return;
            }
            setSelectedFile(file);
          }}
        />
        <h3 className="text-md -mt-2">File size should be less than 5Mb</h3>


        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <div className="loader"></div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
