import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        const result = await authService.forgotPassword(email);

        setLoading(false);

        if (result.success) {
            setMessage(result.message || 'If an account exists with that email, a password reset link has been sent.');
            setEmail('');
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
                        <p className="text-gray-400">Reset your password</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-3">
                            <p className="text-green-400 text-sm">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!message}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
