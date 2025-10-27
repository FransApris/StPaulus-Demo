# Modal UX and Data Format Fixes

## Completed Fixes
- [x] Changed specialForm.status to specialForm.isActive for better UX
- [x] Updated checkbox binding to use isActive
- [x] Modified saveSpecialSchedule to convert isActive to status for API
- [x] Updated closeSpecialModal to reset isActive
- [x] Updated editSpecialSchedule to convert status to isActive

## Modal UX Verification
- [x] Backdrop click handler: @click.self="closeSpecialModal" on outer div
- [x] Modal content click stop: @click.stop on inner modal div

## Data Format Verification
- [x] Date input: type="date" (sends YYYY-MM-DD format)
- [x] Time input: type="time" (sends HH:MM format)
- [x] Status conversion: isActive boolean -> status string ('active'/'inactive')

## Testing Requirements
- [x] Test modal backdrop click - should NOT close modal
- [x] Test form submission - should send correct date/time formats
- [x] Test successful save - no "Gagal menyimpan misa khusus" alert
