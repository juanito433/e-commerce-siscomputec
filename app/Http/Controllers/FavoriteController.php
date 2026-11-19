<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function toggle(Request $request, Product $product)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $user->favorites()->toggle($product->id);

        return back();
    }
}
