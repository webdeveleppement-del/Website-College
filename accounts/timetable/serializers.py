from rest_framework import serializers

from .models import TimetableEntry


class TimetableSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source="school_class.name", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = TimetableEntry

        fields = [
            "id",
            "day",
            "start_time",
            "end_time",
            "school_class",
            "subject",
            "teacher",
            "class_name",
            "subject_name",
            "teacher_name",
            "room",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "class_name",
            "subject_name",
            "teacher_name",
            "created_at",
            "updated_at",
        ]

    def get_teacher_name(self, obj):
        if not obj.teacher:
            return None
        return obj.teacher.user.get_full_name() or obj.teacher.user.username
