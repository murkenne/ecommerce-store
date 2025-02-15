
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { userService} from '../services/userService';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (user?.uid) {
      const userProfile = await userService.getUserProfile(user.uid);
      setName(userProfile?.name || '');
      setAddress(userProfile?.address || '');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.uid) {
      await userService.updateUserProfile(user.uid, { name, address });
      await loadProfile();
      alert('Profile updated successfully!');
    }
  };

  const handleDelete = async () => {
    if (user?.uid && window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await userService.deleteUserAccount(user.uid);
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Profile</h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email || ''}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger w-100"
                >
                  Delete Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
