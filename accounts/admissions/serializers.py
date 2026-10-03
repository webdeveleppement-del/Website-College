from rest_framework import serializers

from .models import Admission


class AdmissionSerializer(
    serializers.ModelSerializer
):

    requested_class_name = serializers.CharField(
        source="requested_class.name",
        read_only=True,
    )

    status_label = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:

        model = Admission

        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "date_of_birth",
            "requested_class",
            "requested_class_name",
            "parent_name",
            "parent_phone",
            "message",
            "status",
            "status_label",
            "admin_note",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "requested_class_name",
            "status_label",
            "created_at",
            "updated_at",
        ]
