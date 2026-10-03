from rest_framework import permissions, viewsets

from apps.accounts.permissions import IsAdminOrTeacher

from .models import TimetableEntry
from .serializers import TimetableSerializer


class TimetableViewSet(viewsets.ModelViewSet):

    queryset = TimetableEntry.objects.select_related(
        "school_class",
        "subject",
        "teacher__user",
    ).all()

    serializer_class = TimetableSerializer

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

        if getattr(user, "role", None) == "ENSEIGNANT":
            queryset = queryset.filter(teacher__user=user)
        elif getattr(user, "role", None) == "ELEVE":
            student = getattr(user, "student_profile", None)
            if student and student.classe_id:
                queryset = queryset.filter(school_class_id=student.classe_id)
            else:
                return queryset.none()

        day = self.request.query_params.get("day")
        class_name = self.request.query_params.get("class_name")
        teacher_name = self.request.query_params.get("teacher_name")

        if day:
            queryset = queryset.filter(day=day)

        if class_name:
            queryset = queryset.filter(school_class__name__icontains=class_name)

        if teacher_name:
            queryset = queryset.filter(
                teacher__user__first_name__icontains=teacher_name
            ) | queryset.filter(
                teacher__user__last_name__icontains=teacher_name
            )

        return queryset
