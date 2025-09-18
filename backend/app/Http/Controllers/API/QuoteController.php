<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Request;
use App\Models\PriceQuote;
use App\Services\QuoteService;
use App\Services\RequestService;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuoteController extends Controller
{
    protected $quoteService;
    protected $requestService;
    
    public function __construct(QuoteService $quoteService, RequestService $requestService)
    {
        $this->quoteService = $quoteService;
        $this->requestService = $requestService;
    }
    
    /**
     * Get all quotes for a specific request.
     */
    public function index(HttpRequest $httpRequest, $requestId): JsonResponse
    {
        try {
            $request = Request::findOrFail($requestId);
            
            // Check authorization
            if (!$this->canViewQuotes($request)) {
                return response()->json(['error' => 'Unauthorized to view quotes for this request'], 403);
            }
            
            $quotes = $this->quoteService->getQuotesForRequest($request);
            $statistics = $this->quoteService->getQuoteStatistics($request);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'quotes' => $quotes,
                    'statistics' => $statistics,
                    'request' => $request->load(['user', 'department'])
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Store a newly created quote.
     */
    public function store(HttpRequest $httpRequest, $requestId): JsonResponse
    {
        try {
            $request = Request::findOrFail($requestId);
            
            // Check authorization
            if (!Auth::user()->hasRole('ACCOUNTANT')) {
                return response()->json(['error' => 'Only accountants can add quotes'], 403);
            }
            
            $validator = Validator::make($httpRequest->all(), [
                'vendor_name' => 'required|string|max:255',
                'vendor_contact' => 'nullable|string|max:255',
                'vendor_email' => 'nullable|email|max:255',
                'vendor_phone' => 'nullable|string|max:20',
                'quote_amount' => 'required|numeric|min:0',
                'quote_details' => 'nullable|string',
                'quote_file' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:5120',
                'validity_date' => 'required|date|after:today',
                'payment_terms' => 'nullable|string|max:255',
                'delivery_time' => 'nullable|string|max:255',
                'notes' => 'nullable|string'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $quote = $this->quoteService->addQuote($request, $httpRequest->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Quote added successfully',
                'data' => $quote->load('creator')
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Display the specified quote.
     */
    public function show($requestId, $quoteId): JsonResponse
    {
        try {
            $request = Request::findOrFail($requestId);
            $quote = PriceQuote::where('request_id', $requestId)
                              ->where('id', $quoteId)
                              ->with('creator')
                              ->firstOrFail();
            
            // Check authorization
            if (!$this->canViewQuotes($request)) {
                return response()->json(['error' => 'Unauthorized to view this quote'], 403);
            }
            
            return response()->json([
                'success' => true,
                'data' => $quote
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update the specified quote.
     */
    public function update(HttpRequest $httpRequest, $requestId, $quoteId): JsonResponse
    {
        try {
            $request = Request::findOrFail($requestId);
            $quote = PriceQuote::where('request_id', $requestId)
                              ->where('id', $quoteId)
                              ->firstOrFail();
            
            // Check authorization
            if (!Auth::user()->hasRole('ACCOUNTANT')) {
                return response()->json(['error' => 'Only accountants can update quotes'], 403);
            }
            
            $validator = Validator::make($httpRequest->all(), [
                'vendor_name' => 'sometimes|string|max:255',
                'vendor_contact' => 'nullable|string|max:255',
                'vendor_email' => 'nullable|email|max:255',
                'vendor_phone' => 'nullable|string|max:20',
                'quote_amount' => 'sometimes|numeric|min:0',
                'quote_details' => 'nullable|string',
                'quote_file' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:5120',
                'validity_date' => 'sometimes|date|after:today',
                'payment_terms' => 'nullable|string|max:255',
                'delivery_time' => 'nullable|string|max:255',
                'notes' => 'nullable|string'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $updatedQuote = $this->quoteService->updateQuote($quote, $httpRequest->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Quote updated successfully',
                'data' => $updatedQuote->load('creator')
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove the specified quote.
     */
    public function destroy($requestId, $quoteId): JsonResponse
    {
        try {
            $request = Request::findOrFail($requestId);
            $quote = PriceQuote::where('request_id', $requestId)
                              ->where('id', $quoteId)
                              ->firstOrFail();
            
            // Check authorization
            if (!Auth::user()->hasRole('ACCOUNTANT')) {
                return response()->json(['error' => 'Only accountants can delete quotes'], 403);
            }
            
            $this->quoteService->deleteQuote($quote);
            
            return response()->json([
                'success' => true,
                'message' => 'Quote deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Select a quote for a request.
     */
    public function selectQuote(HttpRequest $httpRequest, $requestId, $quoteId): JsonResponse
    {
        try {
            $request = Request::findOrFail($requestId);
            $quote = PriceQuote::where('request_id', $requestId)
                              ->where('id', $quoteId)
                              ->firstOrFail();
            
            // Check authorization - only requester can select quotes
            if ($request->requester_id !== Auth::id()) {
                return response()->json(['error' => 'Only the requester can select quotes'], 403);
            }
            
            $validator = Validator::make($httpRequest->all(), [
                'comments' => 'nullable|string|max:1000'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $updatedRequest = $this->quoteService->selectQuote(
                $request, 
                $quote, 
                $httpRequest->input('comments')
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Quote selected successfully',
                'data' => $updatedRequest->load(['selectedQuote', 'approvalHistories.approver'])
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Request quotes for a request (called by accountant).
     */
    public function requestQuotes(HttpRequest $httpRequest, $requestId): JsonResponse
    {
        try {
            $request = Request::findOrFail($requestId);
            
            // Check authorization
            if (!Auth::user()->hasRole('ACCOUNTANT')) {
                return response()->json(['error' => 'Only accountants can request quotes'], 403);
            }
            
            $validator = Validator::make($httpRequest->all(), [
                'comments' => 'nullable|string|max:1000'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $updatedRequest = $this->quoteService->requestQuotes(
                $request,
                $httpRequest->input('comments')
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Quotes requested successfully',
                'data' => $updatedRequest->load(['approvalHistories.approver'])
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get requests that need quotes (for accountants).
     */
    public function getRequestsNeedingQuotes(): JsonResponse
    {
        try {
            // Check authorization
            if (!Auth::user()->hasRole('ACCOUNTANT')) {
                return response()->json(['error' => 'Only accountants can view this'], 403);
            }
            
            $requests = $this->requestService->getRequestsNeedingQuotes();
            
            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get requests with quotes requested.
     */
    public function getRequestsWithQuotes(): JsonResponse
    {
        try {
            $requests = $this->requestService->getRequestsWithQuotesRequested();
            
            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Check if user can view quotes for a request.
     */
    private function canViewQuotes(Request $request): bool
    {
        $user = Auth::user();
        
        // Admins can view all
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Requesters can view their own request quotes
        if ($request->requester_id === $user->id) {
            return true;
        }
        
        // Accountants can view quotes
        if ($user->hasRole('ACCOUNTANT')) {
            return true;
        }
        
        // Direct managers can view quotes for their team members
        if ($user->hasRole('DIRECT_MANAGER') && $request->requester->direct_manager_id === $user->id) {
            return true;
        }
        
        return false;
    }
}
