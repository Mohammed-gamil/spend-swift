<?php

namespace App\Services;

use App\Models\Request;
use App\Models\PriceQuote;
use App\Models\User;
use App\Exceptions\InvalidRequestStateException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class QuoteService
{
    protected $notificationService;
    
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    
    /**
     * Get all quotes for a specific request.
     *
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getQuotesForRequest(Request $request)
    {
        return $request->priceQuotes()
            ->with('creator')
            ->orderBy('quote_amount')
            ->get();
    }
    
    /**
     * Add a price quote to a request.
     *
     * @param Request $request
     * @param array $quoteData
     * @return PriceQuote
     */
    public function addQuote(Request $request, array $quoteData)
    {
        // Can only add quotes to requests that have quotes requested
        if ($request->status !== 'QUOTES_REQUESTED') {
            throw new InvalidRequestStateException('Can only add quotes to requests with status QUOTES_REQUESTED');
        }
        
        return DB::transaction(function () use ($request, $quoteData) {
            // Handle file upload if provided
            $filePath = null;
            if (isset($quoteData['quote_file'])) {
                $filePath = $quoteData['quote_file']->store('quotes', 'public');
            }
            
            // Create the quote
            $quote = $request->priceQuotes()->create([
                'vendor_name' => $quoteData['vendor_name'],
                'vendor_contact' => $quoteData['vendor_contact'] ?? null,
                'vendor_email' => $quoteData['vendor_email'] ?? null,
                'vendor_phone' => $quoteData['vendor_phone'] ?? null,
                'quote_amount' => $quoteData['quote_amount'],
                'quote_details' => $quoteData['quote_details'] ?? null,
                'quote_file_path' => $filePath,
                'validity_date' => $quoteData['validity_date'],
                'payment_terms' => $quoteData['payment_terms'] ?? null,
                'delivery_time' => $quoteData['delivery_time'] ?? null,
                'notes' => $quoteData['notes'] ?? null,
                'created_by' => Auth::id(),
            ]);
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'approver_id' => Auth::id(),
                'status' => 'QUOTE_ADDED',
                'comments' => "Quote added from {$quoteData['vendor_name']} - Amount: {$quoteData['quote_amount']}"
            ]);
            
            // Notify the requester that a new quote has been added
            $this->notificationService->sendNotification(
                $request->requester_id,
                'New price quote added to your request',
                '/requests/' . $request->id
            );
            
            return $quote;
        });
    }
    
    /**
     * Select a quote for a request.
     *
     * @param Request $request
     * @param PriceQuote $quote
     * @param string|null $comments
     * @return Request
     */
    public function selectQuote(Request $request, PriceQuote $quote, ?string $comments = null)
    {
        // Can only select quotes for requests that have quotes available
        if ($request->status !== 'QUOTES_REQUESTED') {
            throw new InvalidRequestStateException('Can only select quotes for requests with status QUOTES_REQUESTED');
        }
        
        // Ensure the quote belongs to this request
        if ($quote->request_id !== $request->id) {
            throw new InvalidRequestStateException('Quote does not belong to this request');
        }
        
        // Check if quote is still valid
        if (!$quote->isValid()) {
            throw new InvalidRequestStateException('Quote has expired');
        }
        
        return DB::transaction(function () use ($request, $quote, $comments) {
            // Mark the quote as selected
            $quote->markAsSelected();
            
            // Update request status
            $request->status = 'QUOTE_SELECTED';
            $request->total_cost = $quote->quote_amount; // Update total cost with selected quote
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'approver_id' => Auth::id(),
                'status' => 'QUOTE_SELECTED',
                'comments' => $comments ?? "Quote selected from {$quote->vendor_name} - Amount: {$quote->quote_amount}"
            ]);
            
            // Notify direct manager for second approval
            $directManager = User::find($request->requester->direct_manager_id);
            if ($directManager) {
                $this->notificationService->sendNotification(
                    $directManager->id,
                    'Request with selected quote needs your approval',
                    '/requests/' . $request->id
                );
            }
            
            return $request;
        });
    }
    
    /**
     * Update an existing quote.
     *
     * @param PriceQuote $quote
     * @param array $quoteData
     * @return PriceQuote
     */
    public function updateQuote(PriceQuote $quote, array $quoteData)
    {
        // Can only update quotes that haven't been selected
        if ($quote->is_selected) {
            throw new InvalidRequestStateException('Cannot update a selected quote');
        }
        
        // Can only update quotes for requests that have quotes requested
        if ($quote->request->status !== 'QUOTES_REQUESTED') {
            throw new InvalidRequestStateException('Can only update quotes for requests with status QUOTES_REQUESTED');
        }
        
        return DB::transaction(function () use ($quote, $quoteData) {
            // Handle file upload if provided
            if (isset($quoteData['quote_file'])) {
                // Delete old file if exists
                if ($quote->quote_file_path) {
                    Storage::disk('public')->delete($quote->quote_file_path);
                }
                
                $quoteData['quote_file_path'] = $quoteData['quote_file']->store('quotes', 'public');
                unset($quoteData['quote_file']);
            }
            
            // Update the quote
            $quote->update($quoteData);
            
            // Add approval history entry
            $quote->request->approvalHistories()->create([
                'approver_id' => Auth::id(),
                'status' => 'QUOTE_UPDATED',
                'comments' => "Quote updated for {$quote->vendor_name}"
            ]);
            
            return $quote;
        });
    }
    
    /**
     * Delete a quote.
     *
     * @param PriceQuote $quote
     * @return void
     */
    public function deleteQuote(PriceQuote $quote)
    {
        // Can only delete quotes that haven't been selected
        if ($quote->is_selected) {
            throw new InvalidRequestStateException('Cannot delete a selected quote');
        }
        
        // Can only delete quotes for requests that have quotes requested
        if ($quote->request->status !== 'QUOTES_REQUESTED') {
            throw new InvalidRequestStateException('Can only delete quotes for requests with status QUOTES_REQUESTED');
        }
        
        DB::transaction(function () use ($quote) {
            // Delete file if exists
            if ($quote->quote_file_path) {
                Storage::disk('public')->delete($quote->quote_file_path);
            }
            
            // Add approval history entry before deletion
            $vendorName = $quote->vendor_name;
            $quote->request->approvalHistories()->create([
                'approver_id' => Auth::id(),
                'status' => 'QUOTE_DELETED',
                'comments' => "Quote deleted for {$vendorName}"
            ]);
            
            // Delete the quote
            $quote->delete();
        });
    }
    
    /**
     * Request quotes for a request (called by accountant after DM approval).
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function requestQuotes(Request $request, ?string $comments = null)
    {
        // Can only request quotes for DM approved requests
        if ($request->status !== 'DM_APPROVED') {
            throw new InvalidRequestStateException('Can only request quotes for DM approved requests');
        }
        
        return DB::transaction(function () use ($request, $comments) {
            // Update status
            $request->status = 'QUOTES_REQUESTED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'approver_id' => Auth::id(),
                'status' => 'QUOTES_REQUESTED',
                'comments' => $comments ?? 'Price quotes requested'
            ]);
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Price quotes have been requested for your request',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }
    
    /**
     * Get quote statistics for a request.
     *
     * @param Request $request
     * @return array
     */
    public function getQuoteStatistics(Request $request)
    {
        $quotes = $this->getQuotesForRequest($request);
        
        if ($quotes->isEmpty()) {
            return [
                'total_quotes' => 0,
                'lowest_quote' => null,
                'highest_quote' => null,
                'average_quote' => null,
                'selected_quote' => null,
            ];
        }
        
        return [
            'total_quotes' => $quotes->count(),
            'lowest_quote' => $quotes->min('quote_amount'),
            'highest_quote' => $quotes->max('quote_amount'),
            'average_quote' => round($quotes->avg('quote_amount'), 2),
            'selected_quote' => $quotes->where('is_selected', true)->first(),
        ];
    }
}