from django.contrib import admin

from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "date",
        "status",
        "arrival_time",
    )

    list_filter = (
        "status",
        "date",
    )

    search_fields = (
        "student__username",
        "student__first_name",
        "student__last_name",
        "student__email",
    )

    date_hierarchy = "date"
