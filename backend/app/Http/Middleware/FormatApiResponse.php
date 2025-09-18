<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FormatApiResponse
{
    /**
     * Format JSON API responses consistently.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        // Only format JSON responses
        if (!($response instanceof JsonResponse)) {
            return $response;
        }
        
        $content = $response->getContent();
        
        try {
            $json = json_decode($content, true);
            
            // Skip if already formatted or empty
            if (empty($json) || isset($json['success'])) {
                return $response;
            }
            
            // Format the response
            $formatted = [
                'success' => $response->isSuccessful(),
                'data' => $json,
            ];
            
            return response()->json($formatted, $response->getStatusCode(), $response->headers->all());
        } catch (\Exception $e) {
            // If we can't decode the JSON, return the original response
            return $response;
        }
    }
}
