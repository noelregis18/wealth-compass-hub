
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  description,
  className = "",
}) => {
  return (
    <Card className={`hover:border-primary/50 transition-colors ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
