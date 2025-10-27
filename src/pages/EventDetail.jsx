// src/pages/EventDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UserAuth();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [sharedWith, setSharedWith] = useState("");

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !user) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Determine permissions
        const isOwner = data.userId === user.uid;
        const isSharedUser =
          data.visibility === "shared" && data.sharedWith?.includes(user.email);
        const isPublic = data.visibility === "public";

        if (!isOwner && !isSharedUser && !isPublic) {
          alert("You are not authorized to view this event.");
          navigate("/");
          return;
        }

        setCanEdit(isOwner);

        // Format date and time
        const fullDateISO = data.date ? data.date.toDate().toISOString() : "";
        const formattedDate = fullDateISO ? fullDateISO.split("T")[0] : "";
        const formattedTime = data.date
          ? data.date.toDate().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "";

        // Set state
        setEventData(data);
        setTitle(data.title);
        setDescription(data.description || "");
        setDate(formattedDate);
        setTime(formattedTime);
        setLocation(data.location || "");
        setVisibility(data.visibility || "private");
        setSharedWith(data.sharedWith?.join(",") || "");
      } else {
        alert("Event not found.");
        navigate("/");
      }
      setLoading(false);
    };

    if (user && id) fetchEvent();
  }, [id, user, navigate]);

  // Update event
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!canEdit) return alert("You are not authorized to edit this event.");
    if (!title || !date || !time)
      return alert("Title, Date, and Time cannot be empty.");

    const combinedDateTime = new Date(`${date}T${time}`);

    try {
      const eventDocRef = doc(db, "events", id);
      await updateDoc(eventDocRef, {
        title,
        description,
        date: combinedDateTime,
        location,
        visibility,
        sharedWith:
          visibility === "shared"
            ? sharedWith
                .split(",")
                .map((e) => e.trim())
                .filter((e) => e)
            : [],
      });

      setEventData((prev) => ({
        ...prev,
        title,
        description,
        location,
        date: { toDate: () => combinedDateTime },
        visibility,
        sharedWith:
          visibility === "shared"
            ? sharedWith
                .split(",")
                .map((e) => e.trim())
                .filter((e) => e)
            : [],
      }));
      setIsEditing(false);
      alert("Event updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Failed to update event.");
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!canEdit) return alert("You are not authorized to delete this event.");
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This cannot be undone."
      )
    )
      return;

    try {
      const eventDocRef = doc(db, "events", id);
      await deleteDoc(eventDocRef);
      alert("Event deleted successfully!");
      navigate("/");
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert("Failed to delete event.");
    }
  };

  if (loading)
    return <div className="text-center mt-20">Loading event details...</div>;
  if (!eventData)
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        Event data could not be loaded.
      </div>
    );

  const fullDateTime = eventData.date ? eventData.date.toDate() : null;
  const displayDate = fullDateTime ? fullDateTime.toLocaleDateString() : "N/A";
  const displayTime = fullDateTime
    ? fullDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {isEditing ? "Edit Event" : eventData.title}
        </h1>
        <div style={{ display: "flex", gap: "24px" }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backgroundColor: isEditing ? "#4B5563" : "#16A34A",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = isEditing
                ? "#374151"
                : "#15803D")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = isEditing
                ? "#4B5563"
                : "#16A34A")
            }
          >
            {isEditing ? "Cancel" : "Edit Event"}
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backgroundColor: "#DC2626",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#B91C1C")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#DC2626")
            }
          >
            Delete Event
          </button>
        </div>
        <div className="flex justify-between items-center mb-8 pb-4 border-b">
          <p className="text-sm text-gray-500">
            Created on:{" "}
            {eventData.createdAt
              ? eventData.createdAt.toDate().toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            Event Owner: <strong>{eventData.userEmail}</strong>
          </p>
        </div>
      </div>

      {/* Form / Display */}
      <form onSubmit={handleUpdate}>
        {isEditing && canEdit ? (
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Visibility */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Visibility
              </label>
              <div className="mb-4 flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                  />{" "}
                  Private
                </label>
                <label>
                  <input
                    type="radio"
                    value="public"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                  />{" "}
                  Public
                </label>
                <label>
                  <input
                    type="radio"
                    value="shared"
                    checked={visibility === "shared"}
                    onChange={() => setVisibility("shared")}
                  />{" "}
                  Shared
                </label>
              </div>
            </div>

            {visibility === "shared" && (
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Share with emails (comma separated)
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={sharedWith}
                  onChange={(e) => setSharedWith(e.target.value)}
                  placeholder="abc@gmail.com, xyz@gmail.com"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-green-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        ) : (
          // Display for all users (owner, shared, public)
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-indigo-700 mb-1">
                  📅 Date
                </p>
                <p className="text-gray-900 font-medium">{displayDate}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-indigo-700 mb-1">
                  ⏰ Time
                </p>
                <p className="text-gray-900 font-medium">{displayTime}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-indigo-700 mb-1">
                  📍 Location
                </p>
                <p className="text-gray-900 font-medium">
                  {eventData.location || "Not Specified"}
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-2">Description</p>
              <div className="text-gray-800 p-4 border rounded-lg bg-gray-50">
                {eventData.description || "No description available."}
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-2">Visibility</p>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3>
                  <strong>{eventData.visibility}</strong>
                </h3>
                {eventData.visibility === "shared" && (
                  <p className="text-sm text-gray-600 mt-1">
                    Shared with: {eventData.sharedWith?.join(", ") || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EventDetail;
