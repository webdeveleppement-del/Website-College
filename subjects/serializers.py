from rest_framework import serializers

from .models import Subject


class SubjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "code",
            "coefficient",
            "description",
            "is_active",
            "date_creation",
        ]
        read_only_fields = [
            "id",
            "date_creation",
        ]
