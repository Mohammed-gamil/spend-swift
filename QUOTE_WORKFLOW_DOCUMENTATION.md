# Quote-Based Approval Workflow Documentation

## نظام الموافقات مع طلبات الأسعار

تم تطوير نظام الموافقات ليشمل workflow جديد مع طلبات الأسعار كما يلي:

### 1. الـ Workflow الجديد

```
المستخدم يرسل طلب → المدير المباشر
                    ↓ (موافقة أولى)
                المحاسب (يطلب عروض أسعار)
                    ↓
            إضافة عروض الأسعار من الموردين
                    ↓
            المستخدم يختار عرض السعر المناسب
                    ↓
            المدير المباشر (موافقة ثانية)
                    ↓
            المحاسب (موافقة نهائية وتحويل الأموال)
```

### 2. حالات الطلب (Request Statuses)

- `DRAFT`: مسودة
- `SUBMITTED`: تم الإرسال (في انتظار موافقة المدير الأولى)
- `DM_APPROVED`: تمت الموافقة من المدير (في انتظار المحاسب لطلب العروض)
- `QUOTES_REQUESTED`: تم طلب عروض الأسعار (في انتظار إضافة العروض)
- `QUOTE_SELECTED`: تم اختيار عرض سعر (في انتظار الموافقة الثانية من المدير)
- `AWAITING_FINAL_APPROVAL`: في انتظار الموافقة النهائية (من المحاسب)
- `ACCT_APPROVED`: تمت الموافقة من المحاسب (جاهز لتحويل الأموال)
- `FUNDS_TRANSFERRED`: تم تحويل الأموال
- `REJECTED`: مرفوض
- `RETURNED`: تم الإرجاع للمراجعة

### 3. نماذج البيانات الجديدة

#### PriceQuote Model
```php
- request_id: ID الطلب
- vendor_name: اسم المورد
- vendor_contact: جهة الاتصال
- vendor_email: بريد إلكتروني
- vendor_phone: رقم الهاتف
- quote_amount: قيمة العرض
- quote_details: تفاصيل العرض
- quote_file_path: مسار الملف المرفق
- validity_date: تاريخ انتهاء صلاحية العرض
- payment_terms: شروط الدفع
- delivery_time: مدة التسليم
- is_selected: هل تم اختيار هذا العرض
- notes: ملاحظات
- created_by: من أضاف العرض
```

### 4. API Endpoints الجديدة

#### إدارة عروض الأسعار
```
GET    /api/requests/{request}/quotes           # عرض جميع العروض للطلب
POST   /api/requests/{request}/quotes           # إضافة عرض جديد
GET    /api/requests/{request}/quotes/{quote}   # عرض عرض سعر محدد
PUT    /api/requests/{request}/quotes/{quote}   # تعديل عرض سعر
DELETE /api/requests/{request}/quotes/{quote}   # حذف عرض سعر
POST   /api/requests/{request}/quotes/{quote}/select # اختيار عرض سعر
```

#### إدارة workflow العروض
```
POST   /api/requests/{request}/request-quotes         # طلب عروض أسعار (محاسب)
POST   /api/requests/{request}/process-by-accountant  # معالجة الطلب بطلب العروض
POST   /api/requests/{request}/second-approval        # الموافقة الثانية (مدير)
POST   /api/requests/{request}/final-approval         # الموافقة النهائية (محاسب)
```

#### عرض البيانات
```
GET    /api/quotes/requests-needing-quotes      # الطلبات المحتاجة لعروض أسعار
GET    /api/quotes/requests-with-quotes         # الطلبات التي بها عروض أسعار
```

### 5. الأدوار والصلاحيات

#### ACCOUNTANT (المحاسب)
- `requests.quotes.add`: إضافة عروض أسعار
- `requests.quotes.edit`: تعديل عروض الأسعار
- `requests.quotes.delete`: حذف عروض الأسعار
- `requests.quotes.request`: طلب عروض أسعار
- `requests.process.accountant`: معالجة الطلبات
- `requests.approve.final`: الموافقة النهائية

#### DIRECT_MANAGER (المدير المباشر)
- `requests.approve.second`: الموافقة الثانية بعد اختيار العرض

#### USER (المستخدم)
- `requests.quotes.select`: اختيار عرض سعر من عروضه

### 6. كيفية الاستخدام

#### للمحاسب:
1. بعد موافقة المدير الأولى، يستدعي `/api/requests/{request}/process-by-accountant`
2. يضيف عروض الأسعار باستخدام `/api/requests/{request}/quotes`
3. بعد اختيار المستخدم، يقوم بالموافقة النهائية `/api/requests/{request}/final-approval`

#### للمستخدم:
1. يشاهد العروض المتاحة `/api/requests/{request}/quotes`
2. يختار العرض المناسب `/api/requests/{request}/quotes/{quote}/select`

#### للمدير:
1. بعد اختيار العرض، يقوم بالموافقة الثانية `/api/requests/{request}/second-approval`

### 7. التحديثات على الكود الموجود

- تم تحديث `RequestService` لإضافة methods جديدة
- تم إنشاء `QuoteService` للتعامل مع عروض الأسعار
- تم تطوير `QuoteController` مع endpoints كاملة
- تم إضافة migrations للـ database schema
- تم تحديث permissions system

### 8. الميزات المضافة

- تتبع كامل لعملية العروض في `ApprovalHistory`
- إشعارات للمستخدمين في كل خطوة
- دعم رفع الملفات مع عروض الأسعار
- إحصائيات العروض (أقل، أعلى، متوسط)
- التحقق من صلاحية العروض
- حماية كاملة للبيانات والصلاحيات

هذا النظام يوفر workflow متكامل ومرن لإدارة الطلبات مع عروض الأسعار بطريقة احترافية ومنظمة.