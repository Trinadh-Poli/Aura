import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'verifying', 'success', 'error'
    const [message, setMessage] = useState(location.state?.message || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !otp) {
            setStatus('error');
            setMessage('Please enter both email and verification code');
            return;
        }

        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            setStatus('error');
            setMessage('Please enter a valid 6-digit verification code');
            return;
        }

        setStatus('verifying');
        setMessage('');

        const result = await authService.verifyOtp(email, otp);

        if (result.success) {
            setStatus('success');
            setMessage(result.message || 'Email verified successfully!');
        } else {
            setStatus('error');
            setMessage(result.error);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setStatus('error');
            setMessage('Please enter your email address');
            return;
        }

        const result = await authService.resendOtp(email);

        if (result.success) {
            setStatus('idle');
            setMessage('A new verification code has been sent to your email');
            setOtp('');
        } else {
            setStatus('error');
            setMessage(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black">
            <div className="max-w-md w-full mx-4">
                <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Aura</h1>
                        <p className="text-gray-400">Email Verification</p>
                    </div>

                    {/* Idle/Form State */}
                    {(status === 'idle' || status === 'error' || status === 'verifying') && (
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

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="000000"
                                    maxLength="6"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Enter the 6-digit code sent to your email
                                </p>
                            </div>

                            {message && (
                                <div className={`rounded-lg p-3 ${status === 'error'
                                        ? 'bg-red-500/10 border border-red-500/50'
                                        : 'bg-green-500/10 border border-green-500/50'
                                    }`}>
                                    <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                        {message}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'verifying'}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                {status === 'verifying' ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Email'
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-purple-400 hover:text-purple-300 text-sm"
                                >
                                    Didn't receive code? Resend
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Verification Successful!</h2>
                            <p className="text-gray-300 mb-6">{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    © 2025 Aura. All rights reserved.
                </p>
            </div>
        </div>
    );
}
