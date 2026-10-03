from django.contrib import admin

from .models import Admission


@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):

    list_display = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "requested_class",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "requested_class",
        "created_at",
    )

    search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "parent_name",
    )

    date_hierarchy = "created_at"
