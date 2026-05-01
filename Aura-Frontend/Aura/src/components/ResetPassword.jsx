import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Invalid or missing reset token.');
        }
    }, [searchParams]);

    const validatePassword = (pass) => {
        // Must be at least 8 characters, contain one digit, one lowercase, one uppercase, and one special character
        const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;
        return regex.test(pass) && pass.length >= 8;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError('Missing reset token. Please use the link sent to your email.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters and contain a number, an uppercase letter, a lowercase letter, and a special character.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        const result = await authService.resetPassword(token, password);

        setLoading(false);

        if (result.success) {
            setMessage(result.message || 'Password reset successful!');
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black">
            <div className="max-w-md w-full mx-4">
                <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Aura</h1>
                        <p className="text-gray-400">Choose a new password</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {message ? (
                        <div className="text-center">
                            <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-3">
                                <p className="text-green-400 text-sm">{message}</p>
                            </div>
                            <Link 
                                to="/login" 
                                className="inline-block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Proceed to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mt-6"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}

                    {!message && (
                        <div className="mt-8 text-center text-sm">
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
