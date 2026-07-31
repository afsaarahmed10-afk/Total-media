-- Update the registered contact email and office address(es) with real
-- values, replacing the placeholders seeded in 0011/0016.

update site_settings
set value = '"uno@nippon-group.com"'
where key in ('contact_email', 'notification_email');

update site_settings
set value = '{
  "offices": [
    {
      "name": "Tokyo Office",
      "lines": ["4-18-13 Ojima, Koto-ku", "Tokyo 136-0072, Japan"]
    },
    {
      "name": "Ibaraki Office",
      "lines": ["571-1 Katsuke Shinden", "Bando-shi, Ibaraki-ken 306-0603, Japan"]
    }
  ]
}'
where key = 'contact_address';
