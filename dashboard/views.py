from django.contrib.auth import get_user_model
from django.db.models import Avg, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.admissions.models import Admission
from apps.attendance.models import Attendance
from apps.contact.models import ContactMessage
from apps.grades.models import Grade
from apps.news.models import News
from apps.students.models import Student
from apps.teachers.models import Teacher
from apps.classes.models import SchoolClass


User = get_user_model()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_overview(request):

    if not (
        request.user.is_superuser
        or request.user.role == "ADMIN"
    ):
        return Response(
            {
                "success": False,
                "message": "Accès administrateur requis.",
            },
            status=status.HTTP_403_FORBIDDEN,
        )


    total_students = Student.objects.count()

    total_teachers = Teacher.objects.count()

    total_classes = SchoolClass.objects.count()

    total_users = User.objects.count()

    total_news = News.objects.count()

    published_news = News.objects.filter(
        is_published=True
    ).count()

    pending_admissions = Admission.objects.filter(
        status=Admission.Status.PENDING
    ).count()

    new_messages = ContactMessage.objects.filter(
        status=ContactMessage.Status.NEW
    ).count()

    total_attendance = Attendance.objects.count()

    present_count = Attendance.objects.filter(
        status=Attendance.Status.PRESENT
    ).count()

    absent_count = Attendance.objects.filter(
        status=Attendance.Status.ABSENT
    ).count()

    late_count = Attendance.objects.filter(
        status=Attendance.Status.RETARD
    ).count()

    excused_count = Attendance.objects.filter(
        status=Attendance.Status.JUSTIFIE
    ).count()

    average_grade = Grade.objects.aggregate(
        average=Avg("value")
    )["average"]

    return Response(
        {
            "success": True,
            "data": {
                "students": total_students,
                "teachers": total_teachers,
                "classes": total_classes,
                "users": total_users,

                "news": {
                    "total": total_news,
                    "published": published_news,
                },

                "admissions": {
                    "pending": pending_admissions,
                },

                "messages": {
                    "new": new_messages,
                },

                "attendance": {
                    "total": total_attendance,
                    "present": present_count,
                    "absent": absent_count,
                    "late": late_count,
                    "excused": excused_count,
                },

                "grades": {
                    "average": (
                        float(average_grade)
                        if average_grade is not None
                        else 0
                    )
                },
            },
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def public_statistics(request):
    total_grades = Grade.objects.count()
    successful_grades = Grade.objects.filter(value__gte=10).count()
    success_rate = (
        round(successful_grades * 100 / total_grades, 1)
        if total_grades
        else 0
    )

    return Response({
        "students": Student.objects.count(),
        "teachers": Teacher.objects.count(),
        "classes": SchoolClass.objects.count(),
        "success_rate": success_rate,
    })
