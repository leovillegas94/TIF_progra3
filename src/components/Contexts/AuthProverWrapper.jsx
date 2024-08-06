import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

const AuthProviderWrapper = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <AuthProvider navigate={navigate} location={location}>
            {children}
        </AuthProvider>
    );
};

AuthProviderWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProviderWrapper;