export const generateQRFilePath = (eventId: string) => {
  return `events/${eventId}/qr-${eventId}-${Date.now()}.png`;
};
