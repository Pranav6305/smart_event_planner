import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { user } = UserAuth();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const eventsRef = collection(db, "events");
    const ownQuery = query(eventsRef, where("userId", "==", user.uid));
    const sharedQuery = query(
      eventsRef,
      where("visibility", "==", "shared"),
      where("sharedWith", "array-contains", user.email)
    );
    const publicQuery = query(eventsRef, where("visibility", "==", "public"));

    const updateEvents = (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setEvents((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        return [...prev, ...list.filter((e) => !existingIds.has(e.id))];
      });
      setLoading(false);
    };

    const ownUnsub = onSnapshot(ownQuery, updateEvents);
    const sharedUnsub = onSnapshot(sharedQuery, updateEvents);
    const publicUnsub = onSnapshot(publicQuery, updateEvents);

    return () => {
      ownUnsub();
      sharedUnsub();
      publicUnsub();
    };
  }, [user]);

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.visibility === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Your Events</h2>

        <div className="flex justify-end mb-6">
          <div className="w-80 bg-white shadow-lg border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-4">
            <span className="text-gray-700 font-semibold text-lg"><strong>Filter: </strong></span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <option value="all">All</option>
              <option value="private">Private</option>
              <option value="shared">Shared</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
      </div>
      <br></br>
      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No events found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
