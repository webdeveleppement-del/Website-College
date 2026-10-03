from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [

    path(
        "admin/",
        admin.site.urls,
    ),

    path(
        "api/auth/",
        include("apps.accounts.urls"),
    ),

    path(
        "api/students/",
        include("apps.students.urls"),
    ),

    path(
        "api/teachers/",
        include("apps.teachers.urls"),
    ),

    path(
        "api/classes/",
        include("apps.classes.urls"),
    ),

    path(
        "api/subjects/",
        include("apps.subjects.urls"),
    ),

    path(
        "api/grades/",
        include("apps.grades.urls"),
    ),

    path(
        "api/attendance/",
        include("apps.attendance.urls"),
    ),

    path(
        "api/timetable/",
        include("apps.timetable.urls"),
    ),

    path(
        "api/news/",
        include("apps.news.urls"),
    ),

    path(
        "api/admissions/",
        include("apps.admissions.urls"),
    ),

    path(
        "api/contact/",
        include("apps.contact.urls"),
    ),

    path(
        "api/dashboard/",
        include("apps.dashboard.urls"),
    ),
]


if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    )
