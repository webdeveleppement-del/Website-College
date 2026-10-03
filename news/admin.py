from django.contrib import admin

from .models import News


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "category",
        "is_published",
        "published_at",
        "author",
    )

    list_filter = (
        "is_published",
        "category",
        "published_at",
    )

    search_fields = (
        "title",
        "category",
        "content",
    )

    prepopulated_fields = {
        "slug": (
            "title",
        )
    }

    date_hierarchy = "published_at"
