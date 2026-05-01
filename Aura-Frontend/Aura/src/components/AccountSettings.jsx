import { Mail, MapPin, Phone, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import authService from '../services/authService';

export default function AccountSettings() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        phoneNumber: '',
        country: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError('');

        const result = await authService.getCurrentUser();

        if (result.success) {
            setProfile(result.user);
            setFormData({
                phoneNumber: result.user.phoneNumber || '',
                country: result.user.country || ''
            });
        } else {
            // Show demo profile when not authenticated
            const demoProfile = {
                id: 1,
                username: 'demouser',
                email: 'demo@aura.com',
                phoneNumber: '+1 234 567 8900',
                country: 'United States',
                isVerified: true,
                roles: [{ id: 1, name: 'USER' }]
            };
            setProfile(demoProfile);
            setFormData({
                phoneNumber: demoProfile.phoneNumber,
                country: demoProfile.country
            });
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // Check if using demo profile
        if (profile.email === 'demo@aura.com') {
            setError('Please login to save changes');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        const result = await authService.updateProfile(profile.id, formData);

        if (result.success) {
            setProfile(result.user);
            setSuccess('Settings updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(result.error || 'Failed to update settings');
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white">Loading settings...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-400">Failed to load settings</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
                    <p className="text-gray-400">Manage your account information</p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                        <p className="text-green-400">{success}</p>
                    </div>
                )}

                {/* Settings Form */}
                <div className="bg-[#121212] rounded-xl p-6 border border-[#2a2a2a]">
                    <div className="space-y-6">
                        {/* Email (Read-only) */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Mail size={16} />
                                Email Address
                            </label>
                            <div className="px-4 py-3 bg-[#2a2a2a] border border-transparent rounded-lg text-gray-400">
                                {profile.email}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Phone size={16} />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="+1 234 567 8900"
                                maxLength={20}
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <MapPin size={16} />
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="United States"
                                maxLength={50}
                            />
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                <Save size={20} />
                                {saving ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
