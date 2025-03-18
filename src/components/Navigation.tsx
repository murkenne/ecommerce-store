import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { getAuth, signOut } from 'firebase/auth';
import { setUser } from '../store/authSlice'; // Ensure this action is correctly imported

export default function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const auth = getAuth(); // Get Firebase Auth instance

  const { data: categories = [], isError: categoriesError, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        console.log('Fetched categories:', data);
        return data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  });

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    if (category === 'all') {
      navigate('/');
    } else {
      navigate(`/category/${category}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      dispatch(setUser(null)); // Dispatch user logout action
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">E-commerce Store</Link>
        <select 
          className="form-select mx-3" 
          style={{width: '200px'}}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category: string) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>
        <div className="d-flex">
          <Link to="/cart" className="btn btn-outline-primary me-2">
            Cart ({items.length})
          </Link>
          {auth.currentUser ? (
            <>
              <Link to="/profile" className="btn btn-outline-secondary me-2">
                Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-secondary me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
