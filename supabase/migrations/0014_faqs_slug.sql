-- Adds a stable, human-readable identifier to `faqs`. The Phase 1 static
-- content used meaningful string ids (e.g. 'faq-quote-turnaround') that a
-- few frontend components reference directly (see
-- src/components/sections/HomeFaqSection.tsx); after migration, faqs.id is
-- a generated UUID, so those references need a separate slug column to
-- keep working. Values below match the original content ids exactly,
-- targeted via the same deterministic UUID each row was seeded with.

alter table faqs add column slug text;

update faqs set slug = 'faq-who-we-work-with' where id = '2caee977-936e-5a62-b6bd-8a4cf9a1842e';
update faqs set slug = 'faq-nationwide-coverage' where id = 'd6977ac5-b10e-591d-8a42-64012f193dce';
update faqs set slug = 'faq-quote-turnaround' where id = '7264c6b4-ae95-5642-9405-2a9aa0a86f5a';
update faqs set slug = 'faq-pricing-basis' where id = '05d75b48-fe76-5907-b469-c31b6adda60e';
update faqs set slug = 'faq-deposit-payment' where id = '7ea28b0c-bd29-5be0-ae61-cb3ee56184dd';
update faqs set slug = 'faq-equipment-only' where id = '13bcab44-d89e-5be1-9fd0-26eaa817d3c6';
update faqs set slug = 'faq-equipment-brands' where id = '9aa76360-f299-579b-90ab-75d5accee25d';
update faqs set slug = 'faq-lead-time' where id = '1c222cfd-9290-5a6a-9d76-4ddabfa5dcfc';
update faqs set slug = 'faq-venue-site-visit' where id = '907dc7f2-a472-5b73-8f9d-80713b6492b5';
update faqs set slug = 'faq-international-language' where id = '50b0d9c4-013b-5627-96e7-3628eb24c8ee';
update faqs set slug = 'faq-hybrid-virtual-reliability' where id = '1bf130f7-3476-5c2a-84e2-7eda6b1d877a';
update faqs set slug = 'faq-power-rigging-safety' where id = 'd9ed0ab4-af79-5997-bc35-fb0a043048f0';
update faqs set slug = 'faq-what-makes-different' where id = 'd5fe5b28-5237-5281-bd57-3f04bf9f8292';
update faqs set slug = 'faq-staffing-scale' where id = 'e9878aae-38b2-599d-9a0c-358d29a494fc';

alter table faqs alter column slug set not null;
alter table faqs add constraint faqs_slug_unique unique (slug);
