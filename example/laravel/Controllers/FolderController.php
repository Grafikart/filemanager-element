<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class FolderController extends Controller
{

    public function index()
    {
        $directories = Storage::disk()->allDirectories();
        return collect($directories)->map([$this, 'toArray']);
    }

    public function store(Request $request)
    {
        $data = Validator::make($request->post(), [
            'parent' => 'alpha_dash',
            'name' => 'required|alpha_dash'
        ])->validated();
        $path = $data['parent'] . '/' . $data['name'];
        Storage::disk()->makeDirectory($path);
        return $this->toArray($path);
    }

    public function delete(string $folder)
    {
        Storage::disk()->deleteDirectory($folder);
        return response('', Response::HTTP_NO_CONTENT);
    }

    public function toArray(string $file): array
    {
        $path = explode('/', trim($file, '/'));
        $dirname = array_pop($path);
        return [
            // use the filepath as an ID
            'id' => $file,
            'name' => $dirname,
            'parent' => implode('/', $path) ?: null,
        ];
    }

}
