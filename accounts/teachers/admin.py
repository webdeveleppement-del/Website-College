from django.contrib import admin

from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = (
        "employee_number",
        "user",
        "specialization",
        "hire_date",
        "is_active",
    )

    list_filter = (
        "is_active",
        "specialization",
    )

    search_fields = (
        "employee_number",
        "user__first_name",
        "user__last_name",
        "user__email",
    )
