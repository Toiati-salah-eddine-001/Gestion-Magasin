<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Store settings
        $storeSettings = [
            ['key' => 'store_name', 'value' => 'Système de Gestion de Stock', 'type' => 'string', 'group' => 'store', 'description' => 'Nom du magasin'],
            ['key' => 'store_address', 'value' => 'Paris, France', 'type' => 'string', 'group' => 'store', 'description' => 'Adresse du magasin'],
            ['key' => 'store_phone', 'value' => '+33123456789', 'type' => 'string', 'group' => 'store', 'description' => 'Numéro de téléphone'],
            ['key' => 'store_email', 'value' => 'info@store.com', 'type' => 'string', 'group' => 'store', 'description' => 'Email du magasin'],
        ];

        // Printing settings
        $printingSettings = [
            ['key' => 'printer_type', 'value' => 'thermal', 'type' => 'string', 'group' => 'printing', 'description' => 'Type d\'imprimante'],
            ['key' => 'receipt_header', 'value' => 'Bienvenue dans notre magasin', 'type' => 'string', 'group' => 'printing', 'description' => 'En-tête du ticket'],
            ['key' => 'receipt_footer', 'value' => 'Merci de votre visite\nPour toute question: +33123456789', 'type' => 'string', 'group' => 'printing', 'description' => 'Pied de page du ticket'],
            ['key' => 'print_logo', 'value' => '0', 'type' => 'boolean', 'group' => 'printing', 'description' => 'Imprimer le logo'],
            ['key' => 'paper_size', 'value' => '80mm', 'type' => 'string', 'group' => 'printing', 'description' => 'Taille du papier'],
        ];

        // System settings
        $systemSettings = [
            ['key' => 'currency', 'value' => '€', 'type' => 'string', 'group' => 'system', 'description' => 'Devise'],
            ['key' => 'timezone', 'value' => 'Europe/Paris', 'type' => 'string', 'group' => 'system', 'description' => 'Fuseau horaire'],
            ['key' => 'date_format', 'value' => 'd/m/Y', 'type' => 'string', 'group' => 'system', 'description' => 'Format de date'],
            ['key' => 'language', 'value' => 'fr', 'type' => 'string', 'group' => 'system', 'description' => 'Langue'],
            ['key' => 'low_stock_threshold', 'value' => '10', 'type' => 'number', 'group' => 'system', 'description' => 'Seuil d\'alerte stock bas'],
        ];

        // Insert all settings
        $allSettings = array_merge($storeSettings, $printingSettings, $systemSettings);
        
        foreach ($allSettings as $setting) {
            Setting::create($setting);
        }
    }
}
