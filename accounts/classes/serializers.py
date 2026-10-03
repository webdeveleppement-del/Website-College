from rest_framework import serializers

from .models import SchoolClass


class SchoolClassSerializer(serializers.ModelSerializer):
    student_count = serializers.IntegerField(
        source="students.count",
        read_only=True,
    )

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "name",
            "level",
            "academic_year",
            "room",
            "capacity",
            "student_count",
            "is_active",
            "date_creation",
        ]
        read_only_fields = [
            "id",
            "student_count",
            "date_creation",
        ]
