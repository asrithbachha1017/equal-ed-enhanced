"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { MOCK_DB } from "@/lib/mock-db";

export function ExportButton() {
    const handleExport = () => {
        // Generate CSV data from Mock Students
        const headers = ["Student ID", "Name", "Grade", "Progress (%)", "Streak (Days)", "Status"];
        const rows = MOCK_DB.students.map((s) =>
            [s.id, s.name, s.grade, s.progress, s.streak, s.status].join(",")
        );

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "student_learning_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export Research Data (CSV)
        </Button>
    );
}
