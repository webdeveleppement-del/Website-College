from django.contrib import admin

from .models import SchoolClass


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "level",
        "academic_year",
        "room",
        "capacity",
        "is_active",
    )

    list_filter = (
        "level",
        "academic_year",
        "is_active",
    )

    search_fields = (
        "name",
        "level",
        "academic_year",
    )
