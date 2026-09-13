import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyInvitation } from '../../api/invitation.service.js';

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No invitation token found in the link.');
      return;
    }

    const runVerification = async () => {
      try {
        const data = await verifyInvitation(token);
        setStatus('success');
        setMessage(data.message || 'Your role has been activated.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'This invitation link is invalid or has expired.');
      }
    };

    runVerification();
  }, [token]);

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
      {status === 'loading' && <p>Verifying your invitation...</p>}

      {status === 'success' && (
        <>
          <h2>Success!</h2>
          <p>{message}</p>
          <Link to="/login">Go to Login</Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h2>Invitation Error</h2>
          <p>{message}</p>
        </>
      )}
    </div>
  );
};

export default Onboarding;