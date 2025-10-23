'use client';
import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-analytics', 'true');
    localStorage.setItem('cookie-marketing', 'true');
    setShowBanner(false);
    // Enable analytics/marketing cookies here
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential-only');
    localStorage.setItem('cookie-analytics', 'false');
    localStorage.setItem('cookie-marketing', 'false');
    setShowBanner(false);
  };

  const savePreferences = () => {
    const analytics = (document.getElementById('analytics') as HTMLInputElement)?.checked;
    const marketing = (document.getElementById('marketing') as HTMLInputElement)?.checked;

    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('cookie-analytics', analytics ? 'true' : 'false');
    localStorage.setItem('cookie-marketing', marketing ? 'true' : 'false');
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6 z-50 shadow-2xl border-t-2 border-green-500 backdrop-blur-lg slide-up">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
              🍪 Cookie Preferences
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
              By continuing to use our site, you agree to our use of cookies.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowPreferences(true)}
              className="px-5 py-3 text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap"
            >
              ⚙️ Manage Preferences
            </button>
            <button
              onClick={acceptEssential}
              className="px-5 py-3 text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap"
            >
              ✓ Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="px-5 py-3 text-sm font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl whitespace-nowrap"
            >
              ✨ Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl bounce-in">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🍪 Cookie Preferences
              </h3>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-green-50 p-4 rounded-xl border-2 border-gray-200">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">✅ Essential Cookies</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Required for the website to function properly. Cannot be disabled.
                  </p>
                  <div className="flex items-center bg-white p-3 rounded-lg">
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="mr-3 w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">Authentication, security, and basic functionality</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">📊 Analytics Cookies</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Help us understand how visitors interact with our website.
                  </p>
                  <div className="flex items-center bg-white p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="analytics"
                      defaultChecked
                      className="mr-3 w-5 h-5 accent-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Google Analytics, usage statistics</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">📢 Marketing Cookies</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Used to deliver personalized advertisements and track campaign effectiveness.
                  </p>
                  <div className="flex items-center bg-white p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="marketing"
                      defaultChecked
                      className="mr-3 w-5 h-5 accent-purple-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Advertising pixels, retargeting</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-5 py-3 text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-100 hover:from-gray-300 hover:to-gray-200 text-gray-800 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-1 px-5 py-3 text-sm font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  💾 Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}