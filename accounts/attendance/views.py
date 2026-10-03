from rest_framework import permissions, viewsets

from apps.accounts.permissions import IsAdminOrTeacher

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):

    queryset = Attendance.objects.select_related("student").all()

    serializer_class = AttendanceSerializer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_permissions(self):
        if self.request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            return [IsAdminOrTeacher()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if getattr(user, "role", None) == "ELEVE":
            queryset = queryset.filter(student=user)

        date = self.request.query_params.get("date")
        status = self.request.query_params.get("status")
        student = self.request.query_params.get("student")

        if date:
            queryset = queryset.filter(date=date)

        if status:
            queryset = queryset.filter(status=status)

        if student:
            queryset = queryset.filter(student_id=student)

        return queryset
