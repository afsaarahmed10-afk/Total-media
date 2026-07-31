-- Align the public contact phone number with the WhatsApp number
-- (WHATSAPP_DISPLAY_NUMBER in src/lib/whatsapp.ts) so visitors see one
-- consistent number across call and WhatsApp contact methods.

update site_settings
set value = '"+81 80-5500-2929"'
where key = 'contact_phone';
