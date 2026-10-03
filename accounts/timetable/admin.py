from django.contrib import admin

from .models import TimetableEntry


@admin.register(TimetableEntry)
class TimetableAdmin(admin.ModelAdmin):

    list_display = (
        "day",
        "start_time",
        "end_time",
        "school_class",
        "subject",
        "teacher",
        "room",
        "day",
    )

    list_filter = (
        "day",
        "school_class",
        "subject",
    )

    search_fields = (
        "school_class__name",
        "subject__name",
        "teacher__user__first_name",
        "teacher__user__last_name",
        "room",
    )
