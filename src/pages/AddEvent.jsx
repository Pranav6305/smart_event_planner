import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [sharedEmails, setSharedEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !date || !time || !user) {
      alert("Title, Date, and Time are required!");
      setLoading(false);
      return;
    }

    const combinedDateTimeString = `${date}T${time}`;

    const emailsArray =
      visibility === "shared"
        ? sharedEmails
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        date: new Date(combinedDateTimeString),
        location,
        userId: user.uid, // store creator UID
        userEmail: user.email, // store creator email
        createdAt: serverTimestamp(),
        visibility,
        sharedWith: emailsArray,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setVisibility("private");
      setSharedEmails("");
      setLoading(false);
      navigate("/");
    } catch (e) {
      console.error("Error adding document to Firestore: ", e);
      setLoading(false);
      alert("Failed to add event to database.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-wide">
            Create New Event
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                  required
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                  />
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                />
              </div>

              {/* Visibility Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                  Event Visibility
                </label>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
                  <div className="flex flex-col space-y-3">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={visibility === "private"}
                        onChange={(e) => {
                          setVisibility(e.target.value);
                          setSharedEmails("");
                        }}
                        className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition flex items-center">
                        <span className="mr-2">🔒</span> Private
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={visibility === "public"}
                        onChange={(e) => {
                          setVisibility(e.target.value);
                          setSharedEmails("");
                        }}
                        className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition flex items-center">
                        <span className="mr-2">🌐</span> Public
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="visibility"
                        value="shared"
                        checked={visibility === "shared"}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition flex items-center">
                        <span className="mr-2">👥</span> Shared
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Shared Emails Input */}
              {visibility === "shared" && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    Share with Emails
                  </label>
                  <input
                    type="text"
                    value={sharedEmails}
                    onChange={(e) => setSharedEmails(e.target.value)}
                    placeholder="user1@example.com, user2@example.com"
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Separate multiple emails with commas
                  </p>
                </div>
              )}

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add event details, agenda, or any additional information..."
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none placeholder-gray-400"
                  rows="5"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-base tracking-wide focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Event..." : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Fields marked with <span className="text-red-500">*</span> are
          required
        </p>
      </div>
    </div>
  );
};

export default AddEvent;
