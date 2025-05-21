from django.contrib import admin
from events.models import Event
from analytics.models import EventReport

class EventReportInline(admin.TabularInline):
    model = EventReport
    readonly_fields = ('created_at', 'file')
    extra = 0


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    inlines = [EventReportInline]
    list_display = ('title','start_date','organizer')
