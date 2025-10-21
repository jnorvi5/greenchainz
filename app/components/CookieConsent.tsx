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
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">🍪 Cookie Preferences</h3>
            <p className="text-sm text-gray-300">
              We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
              By continuing to use our site, you agree to our use of cookies.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Manage Preferences
            </button>
            <button
              onClick={acceptEssential}
              className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cookie Preferences</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Essential Cookies</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Required for the website to function properly. Cannot be disabled.
                  </p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="mr-2"
                    />
                    <span className="text-sm">Authentication, security, and basic functionality</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Help us understand how visitors interact with our website.
                  </p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="analytics"
                      defaultChecked
                      className="mr-2"
                    />
                    <span className="text-sm">Google Analytics, usage statistics</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Used to deliver personalized advertisements and track campaign effectiveness.
                  </p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="marketing"
                      defaultChecked
                      className="mr-2"
                    />
                    <span className="text-sm">Advertising pixels, retargeting</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}