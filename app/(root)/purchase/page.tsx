"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const pricingPlans = [
  {
    name: "Free Plan",
    price: "$0/mo",
    features: ["Ad-Supported", "Task Management", "Basic AI Assistance"],
    cta: "Get Started",
  },
  {
    name: "Pro Plan",
    price: "$14.99/mo",
    features: ["Cloud Storage", "Priority Support", "Advanced AI Insights"],
    cta: "Upgrade Now",
  },
  {
    name: "Ultimate AI Suite",
    price: "$29.99/mo",
    features: ["Full AI Automation", "No Ads", "Premium Support", "API Access"],
    cta: "Get Ultimate AI",
  },
];

const PurchasePage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Choose the Perfect Plan for You</h1>
      <p className="text-gray-600 mb-8">Boost your productivity with AI-driven assistance. Pick a plan that fits your needs.</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className="p-6 border rounded-xl shadow-lg">
            <CardContent>
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-lg text-gray-700 mb-4">{plan.price}</p>
              <ul className="text-left mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-600">✔️ {feature}</li>
                ))}
              </ul>
              <Button className="w-full text-white py-2 rounded-lg">{plan.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Compare Features</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Features</th>
                <th className="border p-3">Free Plan</th>
                <th className="border p-3">Pro Plan</th>
                <th className="border p-3">Ultimate AI Suite</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Ad-Free Experience</td>
                <td className="border p-3">❌</td>
                <td className="border p-3">✔️</td>
                <td className="border p-3">✔️</td>
              </tr>
              <tr>
                <td className="border p-3">AI Assistance</td>
                <td className="border p-3">❌</td>
                <td className="border p-3">❌</td>
                <td className="border p-3">✔️</td>
              </tr>
              <tr>
                <td className="border p-3">Cloud Storage</td>
                <td className="border p-3">❌</td>
                <td className="border p-3">✔️</td>
                <td className="border p-3">✔️</td>
              </tr>
              <tr>
                <td className="border p-3">Priority Support</td>
                <td className="border p-3">❌</td>
                <td className="border p-3">✔️</td>
                <td className="border p-3">✔️ </td>
              </tr>
              <tr>
                {/* <td className="border p-3">API Access</td>
                <td className="border p-3">❌</td>
                <td className="border p-3">❌</td>
                <td className="border p-3">✔️</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;