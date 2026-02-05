import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend?: string;
}

export function AnalyticsCard({ title, value, description, icon: Icon, trend }: AnalyticsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
                {trend && (
                    <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend} from last week
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
