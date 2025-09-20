<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_request_id',
        'accountant_id',
        'amount',
        'description',
        'status',
    ];

    public function purchaseRequest()
    {
        return $this->belongsTo(PurchaseRequest::class);
    }

    public function accountant()
    {
        return $this->belongsTo(User::class, 'accountant_id');
    }
}