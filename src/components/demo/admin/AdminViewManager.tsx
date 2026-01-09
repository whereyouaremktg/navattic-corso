"use client";

import React, { useState } from "react";
import { DemoProvider } from "@/lib/demo-context";
import { DemoLayout } from "@/components/demo/DemoLayout";
import { AdminDashboard } from "./AdminDashboard";
import { AdminShipping } from "./AdminShipping";
import { AdminReturns } from "./AdminReturns";

type AdminView = "analytics" | "returns" | "shipping" | "warranties" | "registrations" | "order-lookup" | "corso-ai";

export function AdminViewManager() {
  const [activeView, setActiveView] = useState<AdminView>("analytics");

  const renderView = () => {
    switch (activeView) {
      case "analytics":
        return <AdminDashboard />;
      case "returns":
        return <AdminReturns />;
      case "shipping":
        return <AdminShipping />;
      case "warranties":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Warranties</h1>
            <p className="mt-2 text-gray-600">Warranties view coming soon...</p>
          </div>
        );
      case "registrations":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Registrations</h1>
            <p className="mt-2 text-gray-600">Registrations view coming soon...</p>
          </div>
        );
      case "order-lookup":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Order Lookup</h1>
            <p className="mt-2 text-gray-600">Order lookup view coming soon...</p>
          </div>
        );
      case "corso-ai":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Corso AI</h1>
            <p className="mt-2 text-gray-600">Corso AI view coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Unknown View</h1>
            <p className="mt-2 text-gray-600">View not found</p>
          </div>
        );
    }
  };

  return (
    <DemoProvider>
      <DemoLayout
        variant="admin"
        activeModule={activeView}
        onModuleChange={(module) => setActiveView(module as AdminView)}
      >
        {renderView()}
      </DemoLayout>
    </DemoProvider>
  );
}
