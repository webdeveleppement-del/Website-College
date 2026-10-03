from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Admission
from .serializers import AdmissionSerializer


class AdmissionViewSet(
    viewsets.ModelViewSet
):

    queryset = Admission.objects.select_related(
        "requested_class",
    ).all()

    serializer_class = AdmissionSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "parent_name",
    ]

    ordering_fields = [
        "created_at",
        "status",
        "last_name",
    ]

    def get_permissions(self):

        if self.action == "create":
            return [
                AllowAny()
            ]

        return [
            IsAdminUser()
        ]
