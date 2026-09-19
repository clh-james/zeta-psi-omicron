"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GOLD_SHADES = ["#C9A227", "#E4C765", "#8A7220", "#7A1330", "#9C1D3E", "#4E0C1F"];

export function MembersByRegionChart({
  data,
}: {
  data: { region: string; members: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members Per Region</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-parchment-muted">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2B30" />
              <XAxis dataKey="region" stroke="#B8AE9B" fontSize={12} />
              <YAxis stroke="#B8AE9B" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#16161A",
                  border: "1px solid #2B2B30",
                  borderRadius: 6,
                  color: "#F3EFE6",
                }}
              />
              <Bar dataKey="members" fill="#C9A227" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function StatusBreakdownChart({
  data,
}: {
  data: { status: string; value: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-parchment-muted">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="status"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={GOLD_SHADES[i % GOLD_SHADES.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#16161A",
                  border: "1px solid #2B2B30",
                  borderRadius: 6,
                  color: "#F3EFE6",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
