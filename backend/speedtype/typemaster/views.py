from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from django.db.models import Q
from .models import (
    UserProfile, 
    WordList, 
    TypingTestResult, 
    UserStatistics
)
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    WordListSerializer,
    TypingTestResultSerializer,
    TypingTestResultCreateSerializer,
    UserStatisticsSerializer,
    LeaderboardSerializer,
    UserRegistrationSerializer,
)


class UserRegistrationViewSet(viewsets.ViewSet):
    """ViewSet for user registration"""
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create related profile and statistics
            UserProfile.objects.create(user=user)
            UserStatistics.objects.create(user=user)
            return Response(
                {'message': 'User registered successfully', 'user': UserSerializer(user).data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Get the profile of the authenticated user"""
        return self.request.user.profile
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user's profile"""
        profile = request.user.profile
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class WordListViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for word lists"""
    queryset = WordList.objects.all()
    serializer_class = WordListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['difficulty']
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Get word lists filtered by difficulty"""
        difficulty = request.query_params.get('difficulty', None)
        if difficulty:
            queryset = WordList.objects.filter(difficulty=difficulty)
        else:
            queryset = self.queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TypingTestResultViewSet(viewsets.ModelViewSet):
    """ViewSet for typing test results"""
    queryset = TypingTestResult.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TypingTestResultCreateSerializer
        return TypingTestResultSerializer
    
    def get_queryset(self):
        """Users can only see their own results, admins can see all"""
        if self.request.user.is_staff:
            return TypingTestResult.objects.all()
        return TypingTestResult.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Associate the result with the current user"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_results(self, request):
        """Get all results for the current user"""
        results = self.get_queryset().order_by('-created_at')
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent test results for the current user"""
        limit = int(request.query_params.get('limit', 10))
        results = self.get_queryset().order_by('-created_at')[:limit]
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get personal statistics"""
        try:
            stats = request.user.statistics
            serializer = UserStatisticsSerializer(stats)
            return Response(serializer.data)
        except UserStatistics.DoesNotExist:
            return Response(
                {'error': 'Statistics not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def best_results(self, request):
        """Get best results by different metrics"""
        metric = request.query_params.get('metric', 'wpm')  # wpm, accuracy
        limit = int(request.query_params.get('limit', 10))
        
        order_by = '-wpm' if metric == 'wpm' else '-accuracy'
        results = self.get_queryset().order_by(order_by)[:limit]
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)


class UserStatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user statistics"""
    queryset = UserStatistics.objects.all()
    serializer_class = UserStatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_statistics(self, request):
        """Get statistics for the current user"""
        try:
            stats = request.user.statistics
            serializer = self.get_serializer(stats)
            return Response(serializer.data)
        except UserStatistics.DoesNotExist:
            return Response(
                {'error': 'Statistics not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Get leaderboard sorted by best WPM"""
        limit = int(request.query_params.get('limit', 100))
        metric = request.query_params.get('metric', 'best_wpm')  # best_wpm, average_wpm
        
        order_by = f'-{metric}'
        leaderboard = UserStatistics.objects.filter(
            total_tests__gt=0
        ).order_by(order_by)[:limit]
        
        data = []
        for rank, stat in enumerate(leaderboard, 1):
            data.append({
                'rank': rank,
                'username': stat.user.username,
                'best_wpm': stat.best_wpm,
                'average_wpm': stat.average_wpm,
                'best_accuracy': stat.best_accuracy,
                'total_tests': stat.total_tests,
            })
        
        serializer = LeaderboardSerializer(data, many=True)
        return Response(serializer.data)

