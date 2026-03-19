from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationViewSet,
    UserProfileViewSet,
    WordListViewSet,
    TypingTestResultViewSet,
    UserStatisticsViewSet,
)

router = DefaultRouter()
router.register(r'users/profile', UserProfileViewSet, basename='user-profile')
router.register(r'word-lists', WordListViewSet, basename='word-list')
router.register(r'results', TypingTestResultViewSet, basename='typing-result')
router.register(r'statistics', UserStatisticsViewSet, basename='statistics')
router.register(r'auth/register', UserRegistrationViewSet, basename='register')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
