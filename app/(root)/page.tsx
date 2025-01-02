"use client"; // Ensures this file is treated as a client component

// import { UserButton } from "@clerk/nextjs";
import React from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const features = [
    { id: 1, label: "Goals", number: 1, color: "#99FFB4", route: "/goals" },
    { id: 2, label: "Todos", number: 2, color: "#F8DFC8", route: "/todos" },
    { id: 3, label: "Shopping List", number: 3, color: "#EEEEEE", route: "/shopping" },
    { id: 4, label: "Books List", number: 4, color: "#C8EAF8", route: "/books" },
    { id: 5, label: "Workout Plans", number: 5, color: "#C8F8CD", route: "/workout-plans" },
    { id: 6, label: "Movies List", number: 6, color: "#F8C8C8", route: "/movies" },
    { id: 7, label: "Health", number: 7, color: "#F8EBC8", route: "/health" },
    { id: 8, label: "Important Dates", number: 8, color: "#C8D2F8", route: "/important-dates" },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="relative flex flex-col items-center justify-center px-16 py-16 border rounded-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer group"
            style={{ backgroundColor: feature.color }}
            onClick={() => handleNavigation(feature.route)}
          >
            <span className="text-center text-lg font-medium text-black">
              {feature.label}
            </span>
            <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full text-xs font-bold transform transition-transform duration-300 group-hover:scale-125">
              {feature.number}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
