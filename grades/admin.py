from django.contrib import admin

from .models import Grade


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "subject",
        "value",
        "coefficient",
        "teacher",
        "date",
    )

    list_filter = (
        "subject",
        "teacher",
        "date",
    )

    search_fields = (
        "student__username",
        "student__first_name",
        "student__last_name",
        "subject__name",
    )

    ordering = (
        "-date",
        "-created_at",
    )
