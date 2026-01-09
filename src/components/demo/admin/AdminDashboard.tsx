"use client";

import React, { useState } from "react";
import { useDemoConfig } from "@/lib/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChevronDown, TrendingUp, DollarSign, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Stat Card Component
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Date Range Selector
// ============================================================================

type DateRange = "7d" | "30d" | "90d" | "1y" | "all";

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: DateRange; label: string }[] = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
    { value: "all", label: "All time" },
  ];

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="size-4" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-50",
                    value === option.value && "bg-gray-50 font-medium"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Claims Over Time Chart
// ============================================================================

interface ClaimsChartProps {
  data: Array<{ date: string; claims: number }>;
}

function ClaimsChart({ data }: ClaimsChartProps) {
  const { config } = useDemoConfig();
  const brandColor = config.brand.primaryColor;

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    claims: item.claims,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium text-gray-800">
            Claims Over Time
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={brandColor}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={brandColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="date"
              className="text-xs text-gray-500"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs text-gray-500"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="claims"
              stroke={brandColor}
              strokeWidth={2}
              fill="url(#colorClaims)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Recent Activity Table
// ============================================================================

interface RecentActivityTableProps {
  claims: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    amount: string;
    status: "pending" | "approved" | "rejected" | "completed";
    date: Date;
  }>;
}

function RecentActivityTable({ claims }: RecentActivityTableProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-800">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">
                  #{claim.orderNumber}
                </TableCell>
                <TableCell>{claim.customerName}</TableCell>
                <TableCell>{claim.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "capitalize",
                      statusColors[claim.status]
                    )}
                  >
                    {claim.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {claim.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main AdminDashboard Component
// ============================================================================

export function AdminDashboard() {
  const { config } = useDemoConfig();
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const analytics = config.admin?.analytics;

  if (!analytics) {
    return (
      <div className="p-8 text-center text-gray-500">
        Analytics data not available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Return Claims"
          value={analytics.totalReturnClaims.toLocaleString()}
          icon={<TrendingUp className="size-4" />}
          trend={{ value: 12.5, isPositive: false }}
        />
        <StatCard
          title="Revenue Saved"
          value={`$${analytics.revenueSaved.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<DollarSign className="size-4" />}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Return Rate"
          value={`${analytics.returnRate}%`}
          icon={<Percent className="size-4" />}
          trend={{ value: 0.5, isPositive: false }}
        />
      </div>

      {/* Claims Over Time Chart */}
      <ClaimsChart data={analytics.claimsOverTime} />

      {/* Recent Activity Table */}
      <RecentActivityTable claims={analytics.recentClaims} />
    </div>
  );
}
