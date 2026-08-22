import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Briefcase, Building, Calendar, Edit3, Check } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfileState } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    profilePictureUrl: ''
  });

  const isHR = user?.role === 'HR' || user?.role === 'ADMIN';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await employeeService.getMyProfile();
        setProfile(data);
        setFormData({
          phone: data.phone || '',
          address: data.address || '',
          profilePictureUrl: data.profilePictureUrl || ''
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await employeeService.updateSelfProfile(formData);
      setProfile(updated);
      updateUserProfileState({
        phone: updated.phone,
        address: updated.address,
        profilePictureUrl: updated.profilePictureUrl
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading employee profile...</div>;

  return (
    <div>
      <Navbar title="My Profile Details" subtitle="View and manage your personal details and employment record" />

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src={profile?.profilePictureUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={profile?.name}
            style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{profile?.name}</h2>
              <StatusBadge status={profile?.role} />
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {profile?.jobTitle} &bull; {profile?.department}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Employee ID: <strong>{profile?.employeeId}</strong> | Joined: {profile?.dateOfJoining}
            </div>
          </div>

          <button onClick={() => setIsEditing(!isEditing)} className="btn btn-secondary">
            <Edit3 size={16} /> {isEditing ? "Cancel" : "Edit Contact Details"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Personal Contact Details</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Note: As an employee, server security rules permit updating only your phone number, address, and profile avatar URL. Job title and department edits require HR authorization.
            </p>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="input-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Residential Address</label>
              <textarea
                className="input-control"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Profile Picture URL</label>
              <input
                type="url"
                className="input-control"
                value={formData.profilePictureUrl}
                onChange={(e) => setFormData({ ...formData, profilePictureUrl: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Check size={18} /> Save Updated Details
            </button>
          </form>
        ) : (
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent-primary)' }}>
                <User size={18} /> Personal Information
              </div>
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div><strong>Email:</strong> {profile?.email}</div>
                <div><strong>Phone:</strong> {profile?.phone || 'Not provided'}</div>
                <div><strong>Address:</strong> {profile?.address || 'Not provided'}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#10b981' }}>
                <Briefcase size={18} /> Job & Position
              </div>
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div><strong>Job Title:</strong> {profile?.jobTitle}</div>
                <div><strong>Department:</strong> {profile?.department}</div>
                <div><strong>Joined On:</strong> {profile?.dateOfJoining}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
