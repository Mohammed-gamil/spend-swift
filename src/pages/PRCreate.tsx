import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { arSA } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Currency, RequestType } from "@/types";
import { usePRStore } from "@/stores/prStore";
import { useApiPRStore } from "@/stores/apiPRStore";
import { useTranslation } from "@/hooks/use-translation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RoleGuard from "@/components/auth/RoleGuard";
import { useAuthStore } from "@/stores/authStore";

const prItemSchema = z.object({
  name: z.string().min(1, "prCreate.errorItemNameRequired"),
  quantity: z.number().min(1, "prCreate.errorQuantityMin"),
  unitPrice: z.number().gt(0, "prCreate.errorUnitPrice"),
  vendorHint: z.string().optional(),
});

// Base form schema with common fields for both request types
const baseFormSchema = z.object({
  type: z.enum(["purchase", "project"] as const),
  title: z.string().min(3, "prCreate.errorTitleMin").max(120, "prCreate.errorTitleMax"),
  description: z.string().max(5000, "prCreate.errorDescriptionMax"),
  category: z.string().min(1, "prCreate.errorCategoryRequired"),
  desiredCost: z.number().gt(0, "prCreate.errorDesiredCost"),
  currency: z.enum(["EGP", "SAR", "USD", "EUR", "GBP", "AED"] as const),
  neededByDate: z.date().min(new Date(), "prCreate.errorNeededByDate"),
});

// Complete form schema with conditional validation based on request type
const prFormSchema = z.discriminatedUnion("type", [
  // Purchase request schema
  z.object({
    type: z.literal("purchase"),
    title: z.string().min(3, "prCreate.errorTitleMin").max(120, "prCreate.errorTitleMax"),
    description: z.string().max(5000, "prCreate.errorDescriptionMax"),
    category: z.string().min(1, "prCreate.errorCategoryRequired"),
    desiredCost: z.number().gt(0, "prCreate.errorDesiredCost"),
    currency: z.enum(["EGP", "SAR", "USD", "EUR", "GBP", "AED"] as const),
    neededByDate: z.date().min(new Date(), "prCreate.errorNeededByDate"),
    items: z.array(prItemSchema).min(1, "prCreate.errorAtLeastOneItem"),
  }),
  // Project request schema
  z.object({
    type: z.literal("project"),
    title: z.string().min(3, "prCreate.errorTitleMin").max(120, "prCreate.errorTitleMax"),
    description: z.string().max(5000, "prCreate.errorDescriptionMax"),
    category: z.string().min(1, "prCreate.errorCategoryRequired"),
    desiredCost: z.number().gt(0, "prCreate.errorDesiredCost"),
    currency: z.enum(["EGP", "SAR", "USD", "EUR", "GBP", "AED"] as const),
    neededByDate: z.date().min(new Date(), "prCreate.errorNeededByDate"),
    // Project-specific fields
    clientName: z.string().min(1, "prCreate.errorClientNameRequired"),
    projectDescription: z.string().min(1, "prCreate.errorProjectDescriptionRequired"),
    totalCost: z.number().gt(0, "prCreate.errorTotalCost"),
    totalBenefit: z.number().min(0, "prCreate.errorTotalBenefit"),
    totalPrice: z.number().gt(0, "prCreate.errorTotalPrice"),
    // Items are optional for projects
    items: z.array(prItemSchema).optional(),
  })
]);

type PRFormData = z.infer<typeof prFormSchema>;

const purchaseSteps = [
  "prCreate.stepBasicInfo",
  "prCreate.stepItems",
  "prCreate.stepReview",
];

const projectSteps = [
  "prCreate.stepBasicInfo",
  "prCreate.stepProjectDetails",
  "prCreate.stepItems",
  "prCreate.stepReview",
];

const purchaseCategories = [
  "IT Equipment",
  "Office Supplies",
  "Software Licenses",
  "Marketing Materials",
  "Travel & Accommodation",
  "Professional Services",
  "Training & Development",
  "Facilities & Maintenance",
  "Other",
];

const projectCategories = [
  "Software Development",
  "IT Infrastructure",
  "Digital Transformation",
  "Business Process Optimization",
  "Marketing Campaign",
  "Research & Development",
  "Product Launch",
  "Consulting Services",
  "Other",
];

const currencies: Currency[] = ["EGP", "SAR", "USD", "EUR", "GBP", "AED"];
const requestTypes: RequestType[] = ["purchase", "project"];

export default function PRCreate() {
  const { t, language } = useTranslation();
  const { id } = useParams(); // Get request ID from URL for edit mode
  const isEditMode = Boolean(id); // Determine if we're in edit mode
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<PRFormData>({
    resolver: zodResolver(prFormSchema),
    defaultValues: {
      type: "purchase",
      title: "",
      description: "",
      category: "",
      desiredCost: 0,
      currency: "USD",
      neededByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      items: [{ name: "", quantity: 1, unitPrice: 0, vendorHint: "" }],
    },
  });

  // Watch the request type to conditionally render form fields
  const requestType = form.watch("type");
  
  // Use appropriate steps based on request type
  const steps = requestType === "purchase" ? purchaseSteps : projectSteps;
  
  // Get appropriate categories based on request type
  const categories = requestType === "purchase" ? purchaseCategories : projectCategories;

  // Field array for items (used for purchase requests primarily)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Handle items list conditionally based on request type
  const watchedItems = form.watch("items") || [];
  const totalCost = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  // Handle request type change
  const handleRequestTypeChange = (type: RequestType) => {
    form.setValue("type", type);
    
    // Reset category when changing request types since they have different options
    form.setValue("category", "");
    
    // Initialize project-specific fields if switching to project
    if (type === "project") {
      form.setValue("clientName", form.getValues("clientName") || "");
      form.setValue("projectDescription", form.getValues("projectDescription") || "");
      form.setValue("totalCost", form.getValues("totalCost") || 0);
      form.setValue("totalBenefit", form.getValues("totalBenefit") || 0);
      form.setValue("totalPrice", form.getValues("totalPrice") || 0);
    }
    
    // Reset current step when changing request type
    setCurrentStep(0);
  };

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    
    if (requestType === "purchase") {
      switch (currentStep) {
        case 0:
          fieldsToValidate = ["type", "title", "description", "category", "desiredCost", "currency", "neededByDate"];
          break;
        case 1:
          fieldsToValidate = ["items"];
          break;
      }
    } else { // project
      switch (currentStep) {
        case 0:
          fieldsToValidate = ["type", "title", "description", "category", "desiredCost", "currency", "neededByDate"];
          break;
        case 1:
          fieldsToValidate = ["clientName", "projectDescription", "totalCost", "totalBenefit", "totalPrice"];
          break;
        case 2:
          // Items are optional for projects
          break;
      }
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Handle Enter key press to prevent accidental form submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      // Move to next step instead of submitting
      if (currentStep < steps.length - 1) {
        nextStep();
      }
    }
  };

  // Use API store for backend integration, fallback to mock store for local data
  const { createRequest: createRequestAPI, updateRequest: updateRequestAPI } = useApiPRStore();
  const { updatePR, prs } = usePRStore(); // Keep for backwards compatibility and local data
  const { reset } = form;

  // Get existing request data in edit mode
  const existingRequest = isEditMode ? prs.find(pr => pr.id === id) : null;

  // Load existing data when in edit mode
  useEffect(() => {
    if (isEditMode && existingRequest) {
      // Populate form with existing data
      form.reset({
        type: existingRequest.type,
        title: existingRequest.title,
        description: existingRequest.description,
        category: existingRequest.category,
        desiredCost: existingRequest.desiredCost,
        currency: existingRequest.currency,
        neededByDate: new Date(existingRequest.neededByDate),
        items: existingRequest.items || [{ name: "", quantity: 1, unitPrice: 0, vendorHint: "" }],
        // Project-specific fields
        ...(existingRequest.type === 'project' && {
          clientName: (existingRequest as any).clientName || "",
          projectDescription: (existingRequest as any).projectDescription || "",
          totalCost: (existingRequest as any).totalCost || 0,
          totalBenefit: (existingRequest as any).totalBenefit || 0,
          totalPrice: (existingRequest as any).totalPrice || 0,
        })
      });
    } else if (isEditMode && !existingRequest) {
      // If in edit mode but request not found, redirect to list
      navigate('/prs');
    }
  }, [isEditMode, existingRequest, form, navigate]);

  const onSubmit = async (data: PRFormData) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      console.log(isEditMode ? 'Updating Request:' : 'Creating Request:', data);
      
      if (isEditMode && id) {
        // Update existing request using API
        await updateRequestAPI(id, {
          type: data.type,
          title: data.title,
          description: data.description,
          category: data.category,
          desiredCost: data.desiredCost,
          currency: data.currency,
          neededByDate: data.neededByDate,
          items: data.items,
          // Project-specific fields
          ...(data.type === 'project' && {
            clientName: data.clientName,
            projectDescription: data.projectDescription,
            totalCost: data.totalCost,
            totalBenefit: data.totalBenefit,
            totalPrice: data.totalPrice,
          })
        });
      } else {
        // Create new request using API
        await createRequestAPI({
          type: data.type,
          title: data.title,
          description: data.description,
          category: data.category,
          desiredCost: data.desiredCost,
          currency: data.currency,
          neededByDate: data.neededByDate,
          items: data.items,
          // Project-specific fields
          ...(data.type === 'project' && {
            clientName: data.clientName,
            projectDescription: data.projectDescription,
            totalCost: data.totalCost,
            totalBenefit: data.totalBenefit,
            totalPrice: data.totalPrice,
          })
        });
      }
      
      console.log(isEditMode ? 'Request updated successfully' : 'Request created successfully');
      
      // Reset form after successful submission (only for create mode)
      if (!isEditMode) {
        reset();
      }
      
      // Navigate back to list
      setTimeout(() => {
        navigate('/prs');
      }, 100);
      
    } catch (error) {
      console.error(isEditMode ? 'Failed to update request:' : 'Failed to create request:', error);
      // Error is already handled by the store with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/prs")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('prCreate.backToPRs')}
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? t('prCreate.titleEdit') : t('prCreate.title')}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? t('prCreate.subtitleEdit') : t('prCreate.subtitle')}
          </p>
        </div>
      </div>

      {/* Stepper */}
  <Stepper steps={steps.map((k) => t(k as any))} currentStep={currentStep} />

      <form 
        onSubmit={(e) => {
          // Prevent auto-submit except when explicitly clicking submit button
          e.preventDefault();
        }}
        onKeyDown={handleKeyDown}
      >
      {/* Step 1: Basic Information */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('prCreate.basicInfoTitle')}</CardTitle>
            <CardDescription>
              {t('prCreate.basicInfoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Request Type Selection */}
            <div className="space-y-2">
              <Label>{t('prCreate.fieldRequestType')}</Label>
              <RadioGroup
                value={form.watch("type")}
                onValueChange={(value) => handleRequestTypeChange(value as RequestType)}
                className="flex space-x-4"
              >
                {requestTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`type-${type}`} />
                    <Label htmlFor={`type-${type}`} className="capitalize">
                      {t(`prCreate.requestType.${type}`)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">{t('prCreate.fieldTitle')}</Label>
                <Input
                  id="title"
                  placeholder={t('prCreate.fieldTitlePlaceholder')}
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{t(form.formState.errors.title.message as any)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('prCreate.fieldCategory')}</Label>
                <Select 
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('prCreate.fieldCategoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      // Explicitly create the translation key with proper casing
                      let translationKey = 'prCreate.categories.';
                      if (category === 'IT Equipment') translationKey += 'itEquipment';
                      else if (category === 'Office Supplies') translationKey += 'officeSupplies';
                      else if (category === 'Software Licenses') translationKey += 'softwareLicenses';
                      else if (category === 'Marketing Materials') translationKey += 'marketingMaterials';
                      else if (category === 'Travel & Accommodation') translationKey += 'travelAccommodation';
                      else if (category === 'Professional Services') translationKey += 'professionalServices';
                      else if (category === 'Training & Development') translationKey += 'trainingDevelopment';
                      else if (category === 'Facilities & Maintenance') translationKey += 'facilitiesMaintenance';
                      else if (category === 'Software Development') translationKey += 'softwareDevelopment';
                      else if (category === 'IT Infrastructure') translationKey += 'infrastructureProjects';
                      else if (category === 'Digital Transformation') translationKey += 'digitalTransformation';
                      else if (category === 'Research & Development') translationKey += 'researchDevelopment';
                      else if (category === 'Consulting Services') translationKey += 'consultingServices';
                      else translationKey += 'other';

                      return (
                        <SelectItem key={category} value={category}>
                          {t(translationKey as any)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">{t(form.formState.errors.category.message as any)}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('prCreate.fieldDescription')}</Label>
              <Textarea
                id="description"
                placeholder={t('prCreate.fieldDescriptionPlaceholder')}
                rows={4}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{t(form.formState.errors.description.message as any)}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="desiredCost">{t('prCreate.fieldEstimatedCost')}</Label>
                <Input
                  id="desiredCost"
                  type="number"
                  step="0.01"
                  placeholder={t('prCreate.fieldCostPlaceholder')}
                  {...form.register("desiredCost", { valueAsNumber: true })}
                />
                {form.formState.errors.desiredCost && (
                  <p className="text-sm text-red-500">{t(form.formState.errors.desiredCost.message as any)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t('prCreate.fieldCurrency')}</Label>
                <Select 
                  value={form.watch("currency")}
                  onValueChange={(value: Currency) => form.setValue("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('prCreate.fieldCurrencyPlaceholder')} />
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
                <Label>{t('prCreate.fieldNeededByDate')}</Label>
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
                        format(form.watch("neededByDate"), "PPP", { locale: language === 'ar' ? arSA : undefined })
                      ) : (
                        <span>{t('prCreate.pickDate')}</span>
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
                  <p className="text-sm text-red-500">{t(form.formState.errors.neededByDate.message as any)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project-specific Details (Step 2 for project requests) */}
      {requestType === "project" && currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('prCreate.projectDetailsTitle')}</CardTitle>
            <CardDescription>
              {t('prCreate.projectDetailsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientName">{t('prCreate.fieldClientName')}</Label>
              <Input
                id="clientName"
                placeholder={t('prCreate.fieldClientNamePlaceholder')}
                {...form.register("clientName")}
              />
              {(form.formState.errors as any).clientName && (
                <p className="text-sm text-red-500">{t((form.formState.errors as any).clientName?.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">{t('prCreate.fieldProjectDescription')}</Label>
              <Textarea
                id="projectDescription"
                placeholder={t('prCreate.fieldProjectDescriptionPlaceholder')}
                rows={4}
                {...form.register("projectDescription")}
              />
              {(form.formState.errors as any).projectDescription && (
                <p className="text-sm text-red-500">{t((form.formState.errors as any).projectDescription?.message)}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="totalCost">{t('prCreate.fieldTotalCost')}</Label>
                <Input
                  id="totalCost"
                  type="number"
                  step="0.01"
                  placeholder={t('prCreate.fieldCostPlaceholder')}
                  {...form.register("totalCost", { valueAsNumber: true })}
                />
                {(form.formState.errors as any).totalCost && (
                  <p className="text-sm text-red-500">{t((form.formState.errors as any).totalCost?.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalBenefit">{t('prCreate.fieldTotalBenefit')}</Label>
                <Input
                  id="totalBenefit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("totalBenefit", { valueAsNumber: true })}
                />
                {(form.formState.errors as any).totalBenefit && (
                  <p className="text-sm text-red-500">{t((form.formState.errors as any).totalBenefit?.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPrice">{t('prCreate.fieldTotalPrice')}</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("totalPrice", { valueAsNumber: true })}
                />
                {(form.formState.errors as any).totalPrice && (
                  <p className="text-sm text-red-500">{t((form.formState.errors as any).totalPrice?.message)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}        {/* Step 2 for purchase, Step 3 for project: Items */}
        {((requestType === "purchase" && currentStep === 1) || (requestType === "project" && currentStep === 2)) && (
          <Card>
            <CardHeader>
              <CardTitle>{t('prCreate.itemsTitle')}</CardTitle>
              <CardDescription>
                {requestType === "purchase" 
                  ? t('prCreate.itemsDescriptionPurchase') 
                  : t('prCreate.itemsDescriptionProject')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Show a message for project requests indicating items are optional */}
              {requestType === "project" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-700 mb-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t('prCreate.projectItemsOptionalMessage')}
                  </p>
                </div>
              )}
              
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{t('prCreate.item')} {index + 1}</h4>
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
                      <Label>{t('prCreate.fieldItemName')}</Label>
                      <Input
                        placeholder={t('prCreate.fieldItemNamePlaceholder')}
                        {...form.register(`items.${index}.name`)}
                      />
                      {form.formState.errors.items?.[index]?.name && (
                        <p className="text-sm text-red-500">
                          {t(form.formState.errors.items[index]?.name?.message as any)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>{t('prCreate.fieldVendorHint')}</Label>
                      <Input
                        placeholder={t('prCreate.fieldVendorHintPlaceholder')}
                        {...form.register(`items.${index}.vendorHint`)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>{t('prCreate.fieldQuantity')}</Label>
                      <Input
                        type="number"
                        min="1"
                        {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                      />
                      {form.formState.errors.items?.[index]?.quantity && (
                        <p className="text-sm text-red-500">
                          {t(form.formState.errors.items[index]?.quantity?.message as any)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>{t('prCreate.fieldUnitPrice')}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t('prCreate.fieldCostPlaceholder')}
                        {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      />
                      {form.formState.errors.items?.[index]?.unitPrice && (
                        <p className="text-sm text-red-500">
                          {t(form.formState.errors.items[index]?.unitPrice?.message as any)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>{t('prCreate.fieldTotal')}</Label>
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
                  {t('prCreate.addItem')}
                </Button>

                <div className="text-right">
                  <p className="text-sm text-gray-600">{t('prCreate.totalCost')}</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(totalCost, form.watch("currency"))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Step: Quotes & Review */}
        {((requestType === "purchase" && currentStep === 2) || (requestType === "project" && currentStep === 3)) && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('prCreate.uploadQuotesTitle')}</CardTitle>
                <CardDescription>
                  {t('prCreate.uploadQuotesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-6 text-center text-gray-500 border border-dashed rounded-lg">
                  {t('prCreate.quotesAddedByAccountant')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('prCreate.reviewTitle')}</CardTitle>
                <CardDescription>
                  {t('prCreate.reviewDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium">Request Type:</p>
                    <p className="capitalize">{t(`prCreate.requestType.${requestType}`)}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium">{t('prCreate.reviewFieldTitle')}</h4>
                    <p className="text-gray-600">{form.watch("title")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">{t('prCreate.reviewFieldCategory')}</h4>
                    <p className="text-gray-600">{form.watch("category")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">{t('prCreate.reviewFieldEstimatedCost')}</h4>
                    <p className="text-gray-600">
                      {formatCurrency(form.watch("desiredCost"), form.watch("currency"))}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">{t('prCreate.reviewFieldNeededBy')}</h4>
                    <p className="text-gray-600">
                      {form.watch("neededByDate") && format(form.watch("neededByDate"), "PPP", { locale: language === 'ar' ? arSA : undefined })}
                    </p>
                  </div>
                </div>

                {form.watch("description") && (
                  <div>
                    <h4 className="font-medium">{t('prCreate.reviewFieldDescription')}</h4>
                    <p className="text-gray-600">{form.watch("description")}</p>
                  </div>
                )}

                {/* Project-specific fields in review */}
                {requestType === "project" && (
                  <div className="border rounded-lg p-4 space-y-4 bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-medium text-lg">{t('prCreate.reviewProjectDetails')}</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium">{t('prCreate.fieldClientName')}</h4>
                        <p className="text-gray-600">{form.watch("clientName")}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">{t('prCreate.fieldProjectDescription')}</h4>
                        <p className="text-gray-600">{form.watch("projectDescription")}</p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <h4 className="font-medium">{t('prCreate.fieldTotalCost')}</h4>
                        <p className="text-gray-600">
                          {formatCurrency(form.watch("totalCost"), form.watch("currency"))}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">{t('prCreate.fieldTotalBenefit')}</h4>
                        <p className="text-gray-600">
                          {formatCurrency(form.watch("totalBenefit"), form.watch("currency"))}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">{t('prCreate.fieldTotalPrice')}</h4>
                        <p className="text-gray-600">
                          {formatCurrency(form.watch("totalPrice"), form.watch("currency"))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items (required for purchase, optional for project) */}
                {(watchedItems && watchedItems.length > 0) && (
                  <div>
                    <h4 className="font-medium">{t('prCreate.reviewItems')} ({watchedItems.length})</h4>
                    <div className="mt-2 space-y-2">
                      {watchedItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span>{item.name} ({language === 'ar' ? '×' : 'x'}{item.quantity})</span>
                          <span className="font-medium">
                            {formatCurrency(item.quantity * item.unitPrice, form.watch("currency"))}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-2 border-t font-bold">
                        <span>{t('prCreate.reviewTotal')}</span>
                        <span>{formatCurrency(totalCost, form.watch("currency"))}</span>
                      </div>
                    </div>
                  </div>
                )}

                {files.length > 0 && (
                  <div>
                    <h4 className="font-medium">{t('prCreate.reviewUploadedFiles')} ({files.length})</h4>
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
            {t('prCreate.buttonPrevious')}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              {t('prCreate.buttonNext')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (isEditMode ? t('prCreate.buttonUpdating') : t('prCreate.buttonSubmitting'))
                : (isEditMode ? t('prCreate.buttonUpdate') : t('prCreate.buttonSubmit'))
              }
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
