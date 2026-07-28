// Sends an admin-notification email when the Contact or Quote form gets a
// new submission. Called fire-and-forget from the client right after the
// insert succeeds (see ContactPage.tsx / QuotePage.tsx) — a failure here
// must never block the visitor's success screen, since the row is already
// saved and visible in /admin either way.
//
// Required secret:  RESEND_API_KEY   (supabase secrets set RESEND_API_KEY=...)
// Optional secret:  RESEND_FROM_EMAIL (defaults to Resend's sandbox sender,
//                    which only delivers to the email the Resend account was
//                    signed up with — verify a domain in Resend and set this
//                    once real notifications need to reach other inboxes)
//
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically by the
// edge runtime — not set manually.

import { corsHeaders } from '../_shared/cors.ts'

type ContactRecord = {
  name: string
  email: string
  company?: string | null
  subject: string
  message: string
}

type QuoteRecord = {
  name: string
  company: string
  country: string
  email: string
  phone: string
  eventType: string
  venue?: string | null
  city: string
  eventDate?: string | null
  attendees?: number | null
  budget?: string | null
  services: string[]
  notes?: string | null
}

type RequestBody =
  | { type: 'contact'; record: ContactRecord }
  | { type: 'quote'; record: QuoteRecord }

const DEFAULT_FROM_EMAIL = 'TOTAL MEDIA <onboarding@resend.dev>'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value: string | null | undefined) {
  if (!value) return ''
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;color:#111827;">${escapeHtml(value)}</td></tr>`
}

function buildEmail(body: RequestBody): { subject: string; html: string } {
  if (body.type === 'contact') {
    const r = body.record
    return {
      subject: `New contact message: ${r.subject}`,
      html: `
        <h2 style="margin:0 0 16px;font-family:sans-serif;">New Contact Message</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
          ${row('Name', r.name)}
          ${row('Email', r.email)}
          ${row('Company', r.company)}
          ${row('Subject', r.subject)}
        </table>
        <p style="font-family:sans-serif;font-size:14px;color:#111827;white-space:pre-wrap;margin-top:16px;">${escapeHtml(r.message)}</p>
      `,
    }
  }

  const r = body.record
  return {
    subject: `New quote request: ${r.company} (${r.eventType})`,
    html: `
      <h2 style="margin:0 0 16px;font-family:sans-serif;">New Quote Request</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
        ${row('Name', r.name)}
        ${row('Company', r.company)}
        ${row('Country', r.country)}
        ${row('Email', r.email)}
        ${row('Phone', r.phone)}
        ${row('Event Type', r.eventType)}
        ${row('Venue', r.venue)}
        ${row('City', r.city)}
        ${row('Event Date', r.eventDate)}
        ${row('Attendees', r.attendees != null ? String(r.attendees) : undefined)}
        ${row('Budget', r.budget)}
        ${row('Services', r.services?.join(', '))}
      </table>
      ${r.notes ? `<p style="font-family:sans-serif;font-size:14px;color:#111827;white-space:pre-wrap;margin-top:16px;">${escapeHtml(r.notes)}</p>` : ''}
    `,
  }
}

async function getNotificationEmail(): Promise<string | null> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) return null

  const res = await fetch(
    `${supabaseUrl}/rest/v1/site_settings?key=in.(notification_email,contact_email)&select=key,value`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  )
  if (!res.ok) return null

  const rows = (await res.json()) as { key: string; value: unknown }[]
  const byKey = new Map(rows.map((r) => [r.key, r.value]))
  const preferred = byKey.get('notification_email') ?? byKey.get('contact_email')
  return typeof preferred === 'string' ? preferred : null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json()) as RequestBody
    if (body.type !== 'contact' && body.type !== 'quote') {
      return new Response(JSON.stringify({ error: 'Invalid submission type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const to = await getNotificationEmail()
    if (!to) {
      return new Response(JSON.stringify({ error: 'No notification email configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { subject, html } = buildEmail(body)
    const from = Deno.env.get('RESEND_FROM_EMAIL') || DEFAULT_FROM_EMAIL

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: body.record.email,
        subject,
        html,
      }),
    })

    if (!resendRes.ok) {
      const detail = await resendRes.text()
      return new Response(JSON.stringify({ error: 'Resend request failed', detail }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
