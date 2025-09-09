import React from 'react';

interface CardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const CustomCard = ({ title, subtitle, children }: CardProps) => {
  return (
    <div className="bg-card/50 border border-accent/20 rounded-lg p-6 shadow-glow">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};