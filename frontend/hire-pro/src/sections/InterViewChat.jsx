import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";

export default function InterviewChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [interviewActive, setInterviewActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startInterview();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (message) => {
    if (!message) return;

    const userMessage = { sender: "You", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      const aiMessage = { sender: "AI", text: data };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: "AI", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const startInterview = async () => {
    setInterviewActive(true);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/start", {
        method: "POST",
      });
      const data = await response.json();
      console.log(data);
      setMessages([{ sender: "AI", text: data}]);
    } catch (error) {
      console.error("Error starting interview:", error);
      setMessages([{ sender: "AI", text: "Failed to start the interview." }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const endInterview = async () => {
    setInterviewActive(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/end", {
        method: "POST",
      });
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { sender: "AI", text: data}]);
    } catch (error) {
      console.error("Error ending interview:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: "AI", text: "Failed to end the interview." }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white p-4">
      <Card className="w-full h-full flex flex-col">
        <CardContent className="flex-grow overflow-y-auto  p-4 bg-gray-800 rounded-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-3 rounded-lg max-w-[80%] ${
                msg.sender === "You"
                  ? "ml-auto bg-blue-600 text-white text-right"
                  : "mr-auto bg-gray-600 text-white text-left"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 mt-2 text-gray-400">
              <Loader2 className="animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <div className="flex w-full fixed bottom-5 left-0 right-0 px-4">
        <div className="flex w-full max-w-4xl mx-auto space-x-2">
          {interviewActive ? (
            <>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                className="flex-grow text-white bg-gray-700 border border-gray-600 placeholder-gray-400"
              />
              <Button onClick={() => sendMessage(input)} disabled={loading}>
                Send
              </Button>
              <Button onClick={endInterview} variant="destructive" disabled={loading}>
                End It
              </Button>
            </>
          ) : (
            <Button onClick={startInterview} className="w-full">
              Restart Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}