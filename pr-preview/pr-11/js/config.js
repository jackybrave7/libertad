const TICKET_CONFIG = {
    // Режим: 'waitlist' — лист ожидания, 'ticket_sale' — продажа через TicketCloud
    mode: 'waitlist',

    ticketCloud: {
        eventId: '6a18a7c5ba34891d46291baa',
        token: 'eyJhbGciOiJIUzI1NiIsImlzcyI6InRpY2tldHNjbG91ZC5ydSIsInR5cCI6IkpXVCJ9.eyJwIjoiNjk3M2ZhODQ5NGNkZjcwN2Y0OGRhNWVmIn0.nPuWfKeQgUiykdoDt-Z6er9JKplylocHd-HPbENz-Tc',
        widgetScript: 'https://ticketscloud.com/static/scripts/widget/tcwidget.js'
    },

    // URL for ticket sales page (leave empty if not using ticket sale mode)
    // Only required when mode is set to 'ticket_sale'. This URL should point to your ticket sales platform
    ticketSaleUrl: '',

    // Google Apps Script URL for handling form submissions and data processing
    // Replace 'YOUR_GOOGLE_SCRIPT_URL_HERE' with your actual Google Apps Script deployment URL
    // This endpoint receives form data and processes it according to your backend logic
    googleScriptUrl: 'https://script.google.com/macros/s/AKfycbxAcvI3xJyBcVWANBUKkWeeqUlXWs6SWR38rWrlXnlfl7wWtmCX9rum_ebQBzH3oZFb/exec'
};
