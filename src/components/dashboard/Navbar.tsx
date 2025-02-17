import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, MessageCircle, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../landing/Logo";
import { auth } from "../../services/auth";
import { SubscriptionButton } from "./SubscriptionButton";
import { api } from "../../config/api";
import { authFetch } from "../../services/authFetch";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists
    const userData = auth.getUser();
    if (!userData && user) {
      // Only reload if we're supposed to have a user (user context exists) but local data is missing
      window.location.reload();
    }
    setIsLoading(false);
  }, [user]); // Add user as a dependency
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authFetch(api.feedback, {
        method: "POST",
        body: JSON.stringify({ feedback }),
      });
      

      if (response.ok) {
        setSubmitStatus("success");
        setFeedback("");
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus(null);
        }, 2500);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700">
      <div className="ml-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center -ml-8">
              <Link to="/dashboard" className="flex items-center">
                <Logo />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Feedback Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 hover:bg-gray-700 rounded-lg flex items-center gap-2 text-gray-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">Feedback</span>
              </button>

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="h-8 w-8 rounded-full border-2 border-gray-600 flex items-center justify-center bg-blue-500 text-white">
                    {!isLoading && (user?.firstName?.charAt(0)?.toUpperCase() || "U")}
                  </div>
                </button>

                {showProfileMenu && !isLoading && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
                    <div className="p-4">
                      <div className="border-b border-gray-700 pb-4">
                        <p className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {user?.email}
                        </p>
                      </div>

                      <div className="pt-4 space-y-2">
                        {/* <SubscriptionButton /> */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 h-[400px] p-8 relative rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">We Value Your Feedback</h2>
            <p className="text-gray-400 mb-4">
              Let us know your thoughts, suggestions, or issues you’re facing. 
              Your feedback helps us improve!
            </p>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label
                  htmlFor="feedback"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us what you think..."
                />
              </div>

              {submitStatus && (
                <div
                  className={`p-3 text-sm rounded-lg text-center ${
                    submitStatus === "success"
                      ? "bg-green-700 text-green-200"
                      : "bg-red-700 text-red-200"
                  }`}
                >
                  {submitStatus === "success"
                    ? "Thank you for your feedback! Our team will contact you shortly."
                    : "Failed to send feedback. Please try again."}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
