from django.contrib import admin
from .models import EventReport

@admin.register(EventReport)
class EventReportAdmin(admin.ModelAdmin):
    list_display = ('event', 'created_at', 'format', 'file_link')
    readonly_fields = ('event', 'created_at', 'format', 'file')

    def file_link(self, obj):
        if obj.file:
            return obj.file.url
        return '-'
    file_link.short_description = "Download report"
