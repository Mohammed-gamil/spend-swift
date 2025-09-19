# Quote Workflow Testing Guide

## إختبار النظام الجديد

### 1. إعداد النظام
```bash
# للـ Linux/Mac
./setup-quote-workflow.sh

# للـ Windows
./setup-quote-workflow.ps1
```

### 2. إختبار الـ API Endpoints

#### أ) إختبار إضافة عرض سعر
```bash
curl -X POST http://localhost:8000/api/requests/1/quotes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_name": "شركة المواد الأولى",
    "vendor_email": "info@materials.com",
    "vendor_phone": "123456789",
    "quote_amount": 5000.00,
    "quote_details": "عرض سعر شامل للمواد المطلوبة",
    "validity_date": "2025-10-01",
    "payment_terms": "30 يوم",
    "delivery_time": "أسبوعين"
  }'
```

#### ب) إختبار عرض العروض
```bash
curl -X GET http://localhost:8000/api/requests/1/quotes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### ج) إختبار اختيار عرض
```bash
curl -X POST http://localhost:8000/api/requests/1/quotes/1/select \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "تم اختيار أفضل عرض"
  }'
```

#### د) إختبار طلب عروض الأسعار
```bash
curl -X POST http://localhost:8000/api/requests/1/process-by-accountant \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "تم طلب عروض الأسعار"
  }'
```

### 3. تسلسل الإختبار الكامل

1. **المستخدم ينشئ طلب** → `POST /api/requests`
2. **المستخدم يرسل الطلب** → `POST /api/requests/{id}/submit`
3. **المدير يوافق** → `POST /api/requests/{id}/approve`
4. **المحاسب يطلب عروض** → `POST /api/requests/{id}/process-by-accountant`
5. **المحاسب يضيف عروض** → `POST /api/requests/{id}/quotes`
6. **المستخدم يختار عرض** → `POST /api/requests/{id}/quotes/{quote_id}/select`
7. **المدير يوافق مرة ثانية** → `POST /api/requests/{id}/second-approval`
8. **المحاسب يوافق نهائياً** → `POST /api/requests/{id}/final-approval`
9. **تحويل الأموال** → `POST /api/requests/{id}/transfer-funds`

### 4. التحقق من الحالات

```bash
# التحقق من حالة الطلب
curl -X GET http://localhost:8000/api/requests/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# التحقق من تاريخ الموافقات
curl -X GET http://localhost:8000/api/requests/1 \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.data.approval_histories'
```

### 5. إختبار الصلاحيات

#### للمحاسب:
- يجب أن يستطيع إضافة/تعديل/حذف عروض الأسعار
- يجب أن يستطيع طلب عروض الأسعار
- يجب أن يستطيع الموافقة النهائية

#### للمدير:
- يجب أن يستطيع الموافقة الأولى والثانية
- لا يجب أن يستطيع إدارة العروض

#### للمستخدم:
- يجب أن يستطيع اختيار عرض من عروضه فقط
- لا يجب أن يستطيع إضافة عروض

### 6. إختبار الأخطاء

```bash
# محاولة اختيار عرض منتهي الصلاحية
# محاولة إضافة عرض بدون صلاحية
# محاولة الموافقة في حالة خاطئة
```

### 7. الملفات المهمة للمراجعة

- `app/Models/PriceQuote.php`
- `app/Services/QuoteService.php`
- `app/Http/Controllers/API/QuoteController.php`
- `database/migrations/2025_09_18_200000_create_price_quotes_table.php`
- `database/seeders/QuotePermissionsSeeder.php`

### 8. لوق الأخطاء المتوقعة

إذا ظهر خطأ:
1. تحقق من الـ database migrations
2. تحقق من الـ permissions
3. راجع لوق الـ Laravel في `storage/logs/laravel.log`

### 9. إختبار الأداء

```bash
# إختبار إضافة عدة عروض
for i in {1..5}; do
  curl -X POST http://localhost:8000/api/requests/1/quotes \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"vendor_name\":\"مورد $i\",\"quote_amount\":$((5000 + i * 100)),\"validity_date\":\"2025-10-01\"}"
done
```