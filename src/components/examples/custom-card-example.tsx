import { CustomCard } from '@/components/ui/custom-card';

// Example usage of the custom card component in a React component
export function CustomCardExample() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Custom Card Examples</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CustomCard 
          title="Project Overview" 
          subtitle="Key metrics and performance"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="text-2xl font-bold">$24,500</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">ROI</span>
                <span className="text-2xl font-bold">34.8%</span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full w-3/4" />
            </div>
          </div>
        </CustomCard>
        
        <CustomCard 
          title="Recent Requests" 
          subtitle="Latest purchase requests"
        >
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Office Supplies</p>
                <p className="text-sm text-muted-foreground">Requested 2 days ago</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success-foreground">
                Approved
              </span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Software Licenses</p>
                <p className="text-sm text-muted-foreground">Requested yesterday</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                Pending
              </span>
            </li>
          </ul>
        </CustomCard>
      </div>
    </div>
  );
}