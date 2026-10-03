from rest_framework import serializers

from .models import Grade


class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Grade

        fields = [
            "id",
            "student",
            "student_name",
            "subject",
            "subject_name",
            "teacher",
            "teacher_name",
            "value",
            "coefficient",
            "assessment",
            "comment",
            "date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student_name",
            "subject_name",
            "teacher_name",
            "date",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        name = (
            f"{obj.student.first_name} "
            f"{obj.student.last_name}"
        ).strip()

        return name or obj.student.username

    def get_teacher_name(self, obj):
        if not obj.teacher:
            return None

        name = (
            f"{obj.teacher.first_name} "
            f"{obj.teacher.last_name}"
        ).strip()

        return name or obj.teacher.username

    def validate_value(self, value):
        if value < 0 or value > 20:
            raise serializers.ValidationError(
                "La note doit être comprise entre 0 et 20."
            )

        return value

    def validate_coefficient(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Le coefficient doit être supérieur à 0."
            )

        return value
