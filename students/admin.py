from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "matricule",
        "user",
        "classe",
        "sexe",
        "statut",
        "date_inscription",
    )

    list_filter = (
        "statut",
        "sexe",
        "classe",
    )

    search_fields = (
        "matricule",
        "user__first_name",
        "user__last_name",
        "user__email",
    )
