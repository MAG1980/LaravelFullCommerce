<?php

namespace App\Http\Requests\Admin;

use App\Concerns\PasswordValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AdminStoreRequest extends FormRequest
{
    use PasswordValidationRules;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|min:3|max:50',
            'username' => 'required|min:5|max:10|unique:users,username',
            // unique:users -уникальный в пределах таблицы users
            'email' => 'required|email|unique:users,email',
//            'phone' => 'required|digits_between:10,12',
            'phone' => 'required|string|min:10|max:12',
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'password' => 'required|min:6|max:20',
            'password_confirmation' => 'required|same:password'
        ];
    }
}
