# إصلاح مشكلة التعديل - كان ينشئ طلب جديد بدلاً من التعديل

## المشكلة
عند محاولة تعديل طلب موجود، كان النظام ينشئ طلب جديد بدلاً من تحديث الطلب الأصلي.

## السبب
1. **صفحة الإنشاء والتعديل نفسها**: كان route `/prs/:id/edit` يستخدم نفس component `PRCreate`
2. **عدم التمييز بين الوضعين**: لم يكن هناك تمييز في الكود بين وضع الإنشاء ووضع التعديل
3. **استدعاء `createRequest` دائماً**: كان يتم استدعاء function الإنشاء بدلاً من التحديث

## الحلول المطبقة

### 1. إضافة دعم وضع التعديل
```tsx
const { id } = useParams(); // الحصول على ID الطلب من URL
const isEditMode = Boolean(id); // تحديد إذا كنا في وضع التعديل
```

### 2. تحميل البيانات الموجودة
```tsx
const existingRequest = isEditMode ? prs.find(pr => pr.id === id) : null;

useEffect(() => {
  if (isEditMode && existingRequest) {
    // تعبئة النموذج بالبيانات الموجودة
    form.reset({
      type: existingRequest.type,
      title: existingRequest.title,
      // ... باقي البيانات
    });
  } else if (isEditMode && !existingRequest) {
    // إذا كان الطلب غير موجود، العودة للقائمة
    navigate('/prs');
  }
}, [isEditMode, existingRequest, form, navigate]);
```

### 3. التمييز في عملية الإرسال
```tsx
const onSubmit = async (data: PRFormData) => {
  if (isEditMode && id) {
    // تحديث الطلب الموجود
    await updatePR(id, {
      // ... البيانات المحدثة
    });
  } else {
    // إنشاء طلب جديد
    await createRequest({
      // ... البيانات الجديدة
    });
  }
};
```

### 4. تحديث واجهة المستخدم
```tsx
// العنوان
<h1>{isEditMode ? t('prCreate.titleEdit') : t('prCreate.title')}</h1>

// الوصف
<p>{isEditMode ? t('prCreate.subtitleEdit') : t('prCreate.subtitle')}</p>

// زر الإرسال
<Button>
  {isSubmitting 
    ? (isEditMode ? t('prCreate.buttonUpdating') : t('prCreate.buttonSubmitting'))
    : (isEditMode ? t('prCreate.buttonUpdate') : t('prCreate.buttonSubmit'))
  }
</Button>
```

### 5. إضافة الترجمات الجديدة
**الإنجليزية:**
```typescript
'prCreate.titleEdit': 'Edit Purchase Request',
'prCreate.subtitleEdit': 'Update the details of your purchase request',
'prCreate.buttonUpdate': 'Update Purchase Request',
'prCreate.buttonUpdating': 'Updating...',
```

**العربية:**
```typescript
'prCreate.titleEdit': 'تعديل طلب الشراء',
'prCreate.subtitleEdit': 'قم بتحديث تفاصيل طلب الشراء',
'prCreate.buttonUpdate': 'تحديث طلب الشراء',
'prCreate.buttonUpdating': 'جاري التحديث...',
```

### 6. حماية من الأخطاء
- التحقق من وجود الطلب قبل التعديل
- إعادة التوجيه للقائمة إذا كان الطلب غير موجود
- منع reset الـ form في وضع التعديل

## النتيجة
- ✅ **وضع الإنشاء**: ينشئ طلب جديد كما هو مطلوب
- ✅ **وضع التعديل**: يحدث الطلب الموجود بدلاً من إنشاء طلب جديد
- ✅ **واجهة واضحة**: عناوين وأزرار مختلفة لكل وضع
- ✅ **حماية من الأخطاء**: التحقق من وجود الطلب قبل التعديل

## كيفية الاختبار

### اختبار وضع الإنشاء:
1. اذهب إلى `/prs/create`
2. املأ البيانات واضغط "إنشاء طلب شراء"
3. تأكد من إنشاء طلب جديد

### اختبار وضع التعديل:
1. اذهب إلى قائمة الطلبات
2. اضغط على زر "تعديل" لأي طلب في حالة DRAFT
3. تأكد من تحميل البيانات الموجودة
4. عدل البيانات واضغط "تحديث طلب الشراء"
5. تأكد من تحديث الطلب الأصلي وليس إنشاء طلب جديد

### اختبار الحماية:
1. جرب الدخول على `/prs/invalid-id/edit`
2. تأكد من إعادة التوجيه لقائمة الطلبات

المشكلة الآن محلولة! 🎉