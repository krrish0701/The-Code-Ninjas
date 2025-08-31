import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  // Fetch users on component mount
  useEffect(() => {
    fetchDemo();
  }, []);

  // Example of how to fetch data from the server (if needed)
  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching hello:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="text-sm text-foreground/70">This route moved. Please go to the new Home.</div>
      <a href="/" className="mt-2 inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Go Home</a>
      <p className="mt-4 hidden max-w-md">{exampleFromServer}</p>
    </div>
  );
}
