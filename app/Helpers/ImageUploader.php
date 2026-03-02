<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageUploader
{
    public static function uploadImage(UploadedFile $image, string $folder, int $maxWidth = 1200, int $maxHeight = 1200): string
    {
        try {
            // $imageName = uniqid() . '_'. time() . $image->getClientOriginalName() . '.' . $image->getClientOriginalExtension();
            $imageName = uniqid() . '_' . time() . '.webp';
            $folder = trim($folder, '/');
            $storagePath = "uploads/{$folder}/{$imageName}";

            $manager = new ImageManager(new Driver());
            $image = $manager->read($image);

            if ($image->width() > $maxWidth) {
                $image->scaleDown($maxWidth, $maxHeight);
            }

            $webQuality = 75;
            $encodedImage = $image->toWebp($webQuality);

            Storage::disk('public')->put($storagePath, $encodedImage->toString());
            $publicPath = str_replace('public/', '/storage/', $storagePath);

            return $publicPath;
        } catch (\Exception $e) {
            report($e);

            return '';
        }

        $image->move(public_path('uploads/' . $folder), $imageName);

        return $imageName;
    }

    public static function deleteImage(string $path): bool
    {
        try {
//        $path = str_replace('/storage/', 'public/', $path);
            if (!Storage::disk('public')->exists($path)) {
                return false;
            }

            Storage::disk('public')->delete($path);
            return true;
        } catch (\Exception $e) {
            report($e);
            return false;
        }
    }
}
