<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all settings or settings by group
     */
    public function index(Request $request)
    {
        if ($request->has('group')) {
            $settings = Setting::getByGroup($request->group);
        } else {
            $settings = Setting::all()->groupBy('group')->map(function ($groupSettings) {
                return $groupSettings->mapWithKeys(function ($setting) {
                    return [$setting->key => $setting->getTypedValue()];
                });
            });
        }

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Get a specific setting
     */
    public function show(string $key)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'الإعداد غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'key' => $setting->key,
                'value' => $setting->getTypedValue(),
                'type' => $setting->type,
                'group' => $setting->group,
                'description' => $setting->description,
            ]
        ]);
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            // Determine the type based on the value
            $type = $this->determineType($value);
            
            Setting::set($key, $value, $type);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ الإعدادات بنجاح'
        ]);
    }

    /**
     * Update store settings
     */
    public function updateStore(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_address' => 'nullable|string',
            'store_phone' => 'nullable|string|max:20',
            'store_email' => 'nullable|email|max:255',
        ]);

        $settings = [
            'store_name' => $request->store_name,
            'store_address' => $request->store_address,
            'store_phone' => $request->store_phone,
            'store_email' => $request->store_email,
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value, 'string', 'store');
        }

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ معلومات المتجر بنجاح'
        ]);
    }

    /**
     * Update printing settings
     */
    public function updatePrinting(Request $request)
    {
        $request->validate([
            'printer_type' => 'nullable|string|max:100',
            'receipt_header' => 'nullable|string',
            'receipt_footer' => 'nullable|string',
            'print_logo' => 'boolean',
            'paper_size' => 'nullable|in:80mm,58mm,A4',
        ]);

        $settings = [
            'printer_type' => $request->printer_type,
            'receipt_header' => $request->receipt_header,
            'receipt_footer' => $request->receipt_footer,
            'print_logo' => $request->print_logo ?? false,
            'paper_size' => $request->paper_size ?? '80mm',
        ];

        foreach ($settings as $key => $value) {
            $type = is_bool($value) ? 'boolean' : 'string';
            Setting::set($key, $value, $type, 'printing');
        }

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ إعدادات الطباعة بنجاح'
        ]);
    }

    /**
     * Update system settings
     */
    public function updateSystem(Request $request)
    {
        $request->validate([
            'currency' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
            'date_format' => 'nullable|string|max:20',
            'language' => 'nullable|in:ar,en',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $settings = [
            'currency' => $request->currency ?? 'ر.س',
            'timezone' => $request->timezone ?? 'Asia/Riyadh',
            'date_format' => $request->date_format ?? 'Y-m-d',
            'language' => $request->language ?? 'ar',
            'low_stock_threshold' => $request->low_stock_threshold ?? 10,
        ];

        foreach ($settings as $key => $value) {
            $type = is_numeric($value) ? 'number' : 'string';
            Setting::set($key, $value, $type, 'system');
        }

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ إعدادات النظام بنجاح'
        ]);
    }

    /**
     * Reset settings to default
     */
    public function reset(Request $request)
    {
        $request->validate([
            'group' => 'required|in:store,printing,system',
        ]);

        $group = $request->group;
        
        // Delete all settings in the group
        Setting::where('group', $group)->delete();

        // Set default values
        $this->setDefaultSettings($group);

        return response()->json([
            'success' => true,
            'message' => 'تم إعادة تعيين الإعدادات إلى القيم الافتراضية'
        ]);
    }

    /**
     * Determine the type of a value
     */
    private function determineType($value): string
    {
        if (is_bool($value)) {
            return 'boolean';
        }
        
        if (is_numeric($value)) {
            return 'number';
        }
        
        if (is_array($value)) {
            return 'json';
        }
        
        return 'string';
    }

    /**
     * Set default settings for a group
     */
    private function setDefaultSettings(string $group): void
    {
        $defaults = match ($group) {
            'store' => [
                'store_name' => 'متجري',
                'store_address' => '',
                'store_phone' => '',
                'store_email' => '',
            ],
            'printing' => [
                'printer_type' => 'thermal',
                'receipt_header' => 'مرحباً بكم في متجرنا',
                'receipt_footer' => 'شكراً لتعاملكم معنا',
                'print_logo' => false,
                'paper_size' => '80mm',
            ],
            'system' => [
                'currency' => 'ر.س',
                'timezone' => 'Asia/Riyadh',
                'date_format' => 'Y-m-d',
                'language' => 'ar',
                'low_stock_threshold' => 10,
            ],
            default => [],
        };

        foreach ($defaults as $key => $value) {
            $type = $this->determineType($value);
            Setting::set($key, $value, $type, $group);
        }
    }
}
