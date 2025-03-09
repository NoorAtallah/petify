import React, { useEffect, useState } from "react";
import axios from "./api/axios";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/contacts");
      setMessages(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch messages. Please try again later.");
      console.error("Error fetching contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (messageId) => {
    try {
      await axios.post(`/admin/contacts/${messageId}/respond`, { response });
      
      setMessages(messages.map(msg =>
        msg._id === messageId
          ? { ...msg, responded: true }
          : msg
      ));
      
      showNotification("Response sent successfully!");
      
      setResponse("");
      setSelectedMessage(null);
    } catch (error) {
      setError("Failed to send response. Please try again.");
      console.error("Error sending response:", error);
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateY(-100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // Pagination calculations
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const selectedMessageData = messages.find(msg => msg._id === selectedMessage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Contact Messages</h2>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-blue-700 font-medium">
            Total Messages: {messages.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No messages found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentMessages.map((msg, index) => (
                    <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {(currentPage - 1) * messagesPerPage + index + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{msg.name}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{msg.email}</td>
                      <td className="py-4 px-6 text-gray-600">{msg.phoneNo}</td>
                      <td className="py-4 px-6 text-gray-600">{msg.city}</td>
                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{msg.message}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedMessage(msg._id)}
                          disabled={msg.responded}
                          className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            msg.responded
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                          }`}
                        >
                          {msg.responded ? "Responded" : "Respond"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(Math.ceil(messages.length / messagesPerPage)).keys()].map(number => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === number + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Response Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Respond to {selectedMessageData?.name}
            </h3>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Original Message:</p>
              <p className="text-gray-700">{selectedMessageData?.message}</p>
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
              placeholder="Type your response..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setResponse("");
                }}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedMessage)}
                disabled={!response.trim()}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  response.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;