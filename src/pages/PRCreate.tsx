import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { FileUpload } from "@/components/ui/file-upload";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Currency } from "@/types";
import { usePRStore } from "@/stores/prStore";

const prItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().gt(0, "Unit price must be greater than 0"),
  vendorHint: z.string().optional(),
});

const prFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title must be less than 120 characters"),
  description: z.string().max(5000, "Description must be less than 5000 characters"),
  category: z.string().min(1, "Category is required"),
  desiredCost: z.number().gt(0, "Desired cost must be greater than 0"),
  currency: z.enum(["EGP", "SAR", "USD", "EUR", "GBP", "AED"] as const),
  neededByDate: z.date().min(new Date(), "Date must be in the future"),
  items: z.array(prItemSchema).min(1, "At least one item is required"),
});

type PRFormData = z.infer<typeof prFormSchema>;

const steps = ["Basic Info", "Items", "Quotes & Review"];

const categories = [
  "IT Equipment",
  "Office Supplies",
  "Software Licenses",
  "Marketing Materials",
  "Travel & Accommodation",
  "Professional Services",
  "Training & Development",
  "Facilities & Maintenance",
  "Other"
];

const currencies: Currency[] = ["EGP", "SAR", "USD", "EUR", "GBP", "AED"];

export default function PRCreate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const form = useForm<PRFormData>({
    resolver: zodResolver(prFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      desiredCost: 0,
      currency: "USD",
      neededByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      items: [{ name: "", quantity: 1, unitPrice: 0, vendorHint: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const totalCost = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const nextStep = async () => {
    let fieldsToValidate: (keyof PRFormData)[] = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ["title", "description", "category", "desiredCost", "currency", "neededByDate"];
        break;
      case 1:
        fieldsToValidate = ["items"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const { createPR } = usePRStore();
  const { reset } = form;

  const onSubmit = async (data: PRFormData) => {
    try {
      console.log('Submitting PR:', data);
      
      await createPR({
        title: data.title,
        description: data.description,
        category: data.category,
        desiredCost: data.desiredCost,
        currency: data.currency,
        neededByDate: data.neededByDate,
        items: data.items.map((item, index) => ({
          id: `item-${index + 1}`,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vendorHint: item.vendorHint,
          total: item.quantity * item.unitPrice,
        })),
        quotes: [],
        approvals: [],
        currentApproverId: undefined,
        currentApprover: undefined,
        fundsTransferredAt: undefined,
      });
      
      console.log('PR created successfully');
      
      // Reset form after successful submission
      reset();
      
      // Add a small delay before navigation to ensure everything is processed
      setTimeout(() => {
        navigate('/prs');
      }, 100);
      
    } catch (error) {
      console.error('Failed to create PR:', error);
      // Error is already handled by the store with toast
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/prs")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to PRs
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Purchase Request</h1>
          <p className="text-gray-600">Fill out the form to create a new purchase request</p>
        </div>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step 1: Basic Information */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details for your purchase request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter request title"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => form.setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you need and why"
                  rows={4}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="desiredCost">Estimated Cost *</Label>
                  <Input
                    id="desiredCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("desiredCost", { valueAsNumber: true })}
                  />
                  {form.formState.errors.desiredCost && (
                    <p className="text-sm text-red-500">{form.formState.errors.desiredCost.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select onValueChange={(value: Currency) => form.setValue("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Needed By Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.watch("neededByDate") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("neededByDate") ? (
                          format(form.watch("neededByDate"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch("neededByDate")}
                        onSelect={(date) => date && form.setValue("neededByDate", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.neededByDate && (
                    <p className="text-sm text-red-500">{form.formState.errors.neededByDate.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Items */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>
                Add the specific items you need to purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Item Name *</Label>
                      <Input
                        placeholder="Enter item name"
                        {...form.register(`items.${index}.name`)}
                      />
                      {form.formState.errors.items?.[index]?.name && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.items[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Vendor Hint</Label>
                      <Input
                        placeholder="Preferred vendor (optional)"
                        {...form.register(`items.${index}.vendorHint`)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                      />
                      {form.formState.errors.items?.[index]?.quantity && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.items[index]?.quantity?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Unit Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      />
                      {form.formState.errors.items?.[index]?.unitPrice && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.items[index]?.unitPrice?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        value={formatCurrency(
                          (watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0),
                          form.watch("currency")
                        )}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: "", quantity: 1, unitPrice: 0, vendorHint: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(totalCost, form.watch("currency"))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Quotes & Review */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Quotes</CardTitle>
                <CardDescription>
                  Upload vendor quotes or supporting documents (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFilesChange={setFiles}
                  maxFiles={5}
                  maxSize={10 * 1024 * 1024}
                  acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>
                  Please review your purchase request before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium">Title</h4>
                    <p className="text-gray-600">{form.watch("title")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Category</h4>
                    <p className="text-gray-600">{form.watch("category")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Estimated Cost</h4>
                    <p className="text-gray-600">
                      {formatCurrency(form.watch("desiredCost"), form.watch("currency"))}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Needed By</h4>
                    <p className="text-gray-600">
                      {form.watch("neededByDate") && format(form.watch("neededByDate"), "PPP")}
                    </p>
                  </div>
                </div>

                {form.watch("description") && (
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-gray-600">{form.watch("description")}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium">Items ({watchedItems.length})</h4>
                  <div className="mt-2 space-y-2">
                    {watchedItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.name} (x{item.quantity})</span>
                        <span className="font-medium">
                          {formatCurrency(item.quantity * item.unitPrice, form.watch("currency"))}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-2 border-t font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(totalCost, form.watch("currency"))}</span>
                    </div>
                  </div>
                </div>

                {files.length > 0 && (
                  <div>
                    <h4 className="font-medium">Uploaded Files ({files.length})</h4>
                    <div className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {file.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit">
              Create Purchase Request
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
