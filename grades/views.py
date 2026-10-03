from rest_framework import generics

from rest_framework.permissions import IsAuthenticated

from apps.accounts.permissions import IsAdminOrTeacher

from .models import Grade
from .serializers import GradeSerializer


class GradeListCreateView(generics.ListCreateAPIView):
    queryset = Grade.objects.select_related(
        "student",
        "subject",
        "teacher",
    ).all()

    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminOrTeacher()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if getattr(user, "role", None) == "ELEVE":
            return queryset.filter(student=user)
        if getattr(user, "role", None) == "ENSEIGNANT":
            return queryset.filter(teacher=user)
        if getattr(user, "role", None) == "ADMIN" or user.is_superuser:
            return queryset
        return queryset.none()

    def perform_create(self, serializer):
        user = self.request.user

        teacher = None

        if getattr(user, "role", None) == "ENSEIGNANT":
            teacher = user

        serializer.save(teacher=teacher)


class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grade.objects.select_related(
        "student",
        "subject",
        "teacher",
    ).all()

    serializer_class = GradeSerializer
    permission_classes = [IsAdminOrTeacher]
