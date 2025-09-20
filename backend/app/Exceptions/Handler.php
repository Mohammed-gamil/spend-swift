<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        if ($request->is('api/*') || $request->wantsJson()) {
            if ($e instanceof ModelNotFoundException) {
                return response()->json(['message' => 'Record not found'], 404);
            }

            if ($e instanceof AuthorizationException) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
            $message = config('app.debug') ? $e->getMessage() : 'Server error';

            return response()->json(['message' => $message], $status);
        }

        return parent::render($request, $e);
    }
}
