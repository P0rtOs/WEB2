from django.contrib import admin
from .models import EventReport

@admin.register(EventReport)
class EventReportAdmin(admin.ModelAdmin):
    list_display    = ('event', 'created_at', 'file')
    readonly_fields = ('created_at', 'file')
