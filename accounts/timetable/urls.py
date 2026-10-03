from rest_framework.routers import DefaultRouter

from .views import TimetableViewSet


router = DefaultRouter()

router.register(
    r"entries",
    TimetableViewSet,
    basename="timetable-entry",
)

urlpatterns = router.urls
