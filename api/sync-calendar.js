// Vercel Serverless Function — Google Calendar API proxy
// Env vars required (set in Vercel dashboard):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PRIVATE_KEY
//   GOOGLE_CALENDAR_ID

function getBusinessHours(date) {
  const day = new Date(date).getDay();
  if (day === 0) return null; // Sunday closed
  if (day === 6) return { open: 10, close: 17 }; // Saturday
  return { open: 9, close: 19 }; // Mon-Fri
}

function generateTimeSlots(open, close) {
  const slots = [];
  for (let h = open; h < close; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      );
    }
  }
  return slots;
}

function computeAvailability(events, date) {
  const hours = getBusinessHours(date);
  if (!hours) {
    return { businessHours: null, available: [], booked: [] };
  }

  const allSlots = generateTimeSlots(hours.open, hours.close);
  const bookedSlots = [];

  for (const event of events) {
    const startStr = event.start?.dateTime || event.start?.date;
    const endStr = event.end?.dateTime || event.end?.date;
    if (!startStr || !endStr) continue;

    const startH = new Date(startStr).getHours();
    const startMin = new Date(startStr).getMinutes();
    const endH = new Date(endStr).getHours();
    const endMin = new Date(endStr).getMinutes();

    const startSlot =
      `${String(startH).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    const endSlot =
      `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    // Mark all 30-min slots within this event as booked
    let current = startSlot;
    while (current < endSlot) {
      bookedSlots.push(current);
      const [h, m] = current.split(':').map(Number);
      const total = h * 60 + m + 30;
      current =
        `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    }

    bookedSlots.push({
      start: startSlot,
      end: endSlot,
      summary: event.summary || 'Ocupado',
    });
  }

  const bookedSet = new Set(bookedSlots.filter((s) => typeof s === 'string'));
  const available = allSlots.filter((t) => !bookedSet.has(t));
  const booked = bookedSlots.filter((s) => typeof s === 'object');

  return {
    businessHours: hours,
    available,
    booked,
  };
}

async function getAuthClient() {
  try {
    const { JWT } = await import('google-auth-library');
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };

    if (!credentials.client_email || !credentials.private_key) {
      return null;
    }

    return new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  } catch {
    return null;
  }
}

async function getCalendarApi() {
  const { google } = await import('googleapis');
  const auth = await getAuthClient();
  return google.calendar({ version: 'v3', auth });
}

function error(status, message) {
  return { error: true, status, message };
}

function json(data, status = 200) {
  return { success: true, status, data };
}

// ─── Action Handlers ───

async function handleCheckAvailability(body) {
  const { date } = body;
  if (!date) return error(400, 'El campo date es obligatorio.');

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    // Fallback: return mock availability if no calendar configured
    const hours = getBusinessHours(date);
    if (!hours) {
      return json({
        date,
        businessHours: null,
        available: [],
        booked: [],
      });
    }
    const allSlots = generateTimeSlots(hours.open, hours.close);
    return json({
      date,
      businessHours: hours,
      available: allSlots,
      booked: [],
    });
  }

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const calendar = await getCalendarApi();
  const response = await calendar.events.list({
    calendarId,
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items || [];
  const availability = computeAvailability(events, date);

  return json({
    date,
    businessHours: availability.businessHours,
    available: availability.available,
    booked: availability.booked,
  });
}

async function handleCreateEvent(body) {
  const { summary, start, end, description } = body;
  if (!summary || !start || !end) {
    return error(400, 'Los campos summary, start y end son obligatorios.');
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    // Fallback: return success with mock data
    return json({
      success: true,
      event: {
        id: `mock-${Date.now()}`,
        htmlLink: '#',
        start: { dateTime: start },
        end: { dateTime: end },
      },
    });
  }

  const calendar = await getCalendarApi();
  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description: description || '',
      start: { dateTime: start, timeZone: 'America/Argentina/Buenos_Aires' },
      end: { dateTime: end, timeZone: 'America/Argentina/Buenos_Aires' },
    },
  });

  const event = response.data;
  return json({
    success: true,
    event: {
      id: event.id,
      htmlLink: event.htmlLink,
      start: event.start,
      end: event.end,
    },
  });
}

async function handleListEvents(body) {
  const { timeMin, timeMax } = body;
  if (!timeMin || !timeMax) {
    return error(400, 'Los campos timeMin y timeMax son obligatorios.');
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    return json({ events: [] });
  }

  const calendar = await getCalendarApi();
  const response = await calendar.events.list({
    calendarId,
    timeMin: new Date(timeMin).toISOString(),
    timeMax: new Date(timeMax).toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return json({ events: response.data.items || [] });
}

async function handleDeleteEvent(body) {
  const { eventId } = body;
  if (!eventId) return error(400, 'El campo eventId es obligatorio.');

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    return json({ success: true });
  }

  const calendar = await getCalendarApi();
  await calendar.events.delete({ calendarId, eventId });

  return json({ success: true });
}

// ─── Route Handler ───

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: 'Método no permitido. Usá POST.' });
  }

  try {
    const body = req.body || {};
    const { action } = body;

    let result;
    switch (action) {
      case 'check-availability':
        result = await handleCheckAvailability(body);
        break;
      case 'create-event':
        result = await handleCreateEvent(body);
        break;
      case 'list-events':
        result = await handleListEvents(body);
        break;
      case 'delete-event':
        result = await handleDeleteEvent(body);
        break;
      default:
        result = error(400, `Acción desconocida: ${action}.`);
    }

    if (result && result.error) {
      return res.status(result.status || 400).json({ error: true, message: result.message });
    }
    
    return res.status(result.status || 200).json(result.data || {});
  } catch (err) {
    console.error('Calendar API error:', err);
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
}
