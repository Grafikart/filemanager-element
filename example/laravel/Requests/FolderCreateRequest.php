<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class FolderCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent' => 'nullable|regex:/^[0-9a-zA-Z_\-\/]+$/',
            'name' => 'required|regex:/^[0-9a-zA-Z_\-]+$/'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'message' => $validator->errors()->first(),
            'errors' => $validator->errors()->messages(),
        ], 422);

        throw new ValidationException($validator, $response);
    }
}
