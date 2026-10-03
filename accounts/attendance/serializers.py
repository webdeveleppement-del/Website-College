from rest_framework import serializers

from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = [
            "id",
            "student",
            "student_name",
            "date",
            "status",
            "arrival_time",
            "reason",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        name = f"{obj.student.first_name} {obj.student.last_name}".strip()

        if name:
            return name

        return obj.student.username
