import { useEffect, useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { getProfile, updateProfile } from "../../services/api";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();

        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedProfile = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      setProfile(updatedProfile);

      setName(updatedProfile.name || "");
      setEmail(updatedProfile.email || "");
      setPhone(updatedProfile.phone || "");

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p className="error-message">
          {error || "Profile information isn't available."}
        </p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <span className="profile-eyebrow">ACCOUNT</span>
          <h1>Profile</h1>
          <p>
            Manage the contact information associated with your account.
          </p>
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {success && (
        <p className="success-message">
          {success}
        </p>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profile-name">
            <User size={16} />
            Full name
          </label>

          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile-email">
            <Mail size={16} />
            Email address
          </label>

          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile-phone">
            <Phone size={16} />
            Phone number
          </label>

          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="e.g. 0799 000 000"
          />

          <p className="form-hint">
            This number can be shown to tenants as the property manager's
            contact number.
          </p>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default Profile;