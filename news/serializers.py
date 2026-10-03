from rest_framework import serializers

from .models import News


class NewsSerializer(serializers.ModelSerializer):

    author_name = serializers.SerializerMethodField()

    class Meta:

        model = News

        fields = [
            "id",
            "title",
            "slug",
            "category",
            "excerpt",
            "content",
            "image",
            "author",
            "author_name",
            "is_published",
            "published_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "author",
            "author_name",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj):

        if not obj.author:
            return None

        return obj.author.get_full_name()
