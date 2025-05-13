from django.contrib import admin
from events.models import Event
from analytics.models import EventReport

class EventReportInline(admin.TabularInline):
    model = EventReport
    extra = 0
    readonly_fields = ('created_at','format','file')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    inlines = [EventReportInline]
    list_display = ('title','start_date','organizer')
