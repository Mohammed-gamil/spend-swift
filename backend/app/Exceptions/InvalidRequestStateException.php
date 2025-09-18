<?php

namespace App\Exceptions;

use Exception;

class InvalidRequestStateException extends Exception
{
    // Exception thrown when a request is in an invalid state for the attempted action
}