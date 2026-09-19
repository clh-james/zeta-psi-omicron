"use client";

import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportsChartsProps {
  statusData: { name: string; value: number }[];
  regionData: { name: string; value: number }[];
}

const STATUS_COLORS = {
  Active: "#22c55e", // Green
  Pending: "#eab308", // Yellow
  Suspended: "#ef4444", // Red
};

export function ReportsCharts({ statusData, regionData }: ReportsChartsProps) {
  const chartsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!chartsRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await htmlToImage.toPng(chartsRef.current, {
        pixelRatio: 2,
        backgroundColor: '#1a1a1a' // Onyx background
      });
      
      const link = document.createElement("a");
      link.download = `ZPO_Analytics_Report_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export charts", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isExporting}
          className="border-gold/30 text-gold hover:bg-gold/10"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isExporting ? "Generating..." : "Export Charts"}
        </Button>
      </div>

      <div ref={chartsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-2 p-2 rounded-lg bg-onyx">
        {/* Status Distribution */}
        <div className="card-surface p-6">
          <h2 className="mb-6 font-display text-lg text-gold">Membership Status</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || "#d4af37"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#333",
                    color: "#f5f5dc",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#d4af37" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            {statusData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || "#d4af37",
                  }}
                />
                <span className="text-sm text-parchment-muted">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="card-surface p-6">
          <h2 className="mb-6 font-display text-lg text-gold">Members by Region</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "#2a2a2a" }}
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#333",
                    color: "#f5f5dc",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#d4af37" }}
                />
                <Bar dataKey="value" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
